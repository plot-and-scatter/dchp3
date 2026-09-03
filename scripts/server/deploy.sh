#!/usr/bin/bash
# Deploy DCHP-3. Run by hand, watched.
#
#   dchp3-deploy staging [branch]
#   dchp3-deploy production
#
# One script for both, because two that had to be kept in step by hand did not
# stay in step: staging spent weeks without the rollback line, the confirmation
# and the health check that production had, and kept a swallowed restart error
# that production did not. The differences between the two are four values, and
# they are all at the top of this file.
#
# Staging offers a choice from the open pull requests, since trying a branch
# before it reaches main is what staging is for. Production deploys main and
# nothing else: anything else wants a deliberate checkout by hand, and having
# to do it by hand is the point.
#
# Install to /usr/local/sbin, NOT to either deployed tree. This rewrites the
# tree while running, and bash reads a script as it goes, so a copy running
# from inside the tree can be replaced underneath itself part-way through.
#
# Serving is start-staging.sh and start-production.sh. This is the only thing
# that installs or builds.

set -euo pipefail
export PATH=/opt/node-v22.23.2-linux-x64/bin:${PATH}

readonly REPO=plot-and-scatter/dchp3

environment="${1:-}"

case "${environment}" in
  staging)
    readonly TREE=/var/www/dchp3-staging
    readonly PORT=8081
    readonly UNIT=dchp3-staging
    readonly CHOOSE_BRANCH=yes
    ;;
  production)
    readonly TREE=/var/www/dchp3
    readonly PORT=3000
    readonly UNIT=dchp3-remix-server
    readonly CHOOSE_BRANCH=no
    ;;
  *)
    echo "Usage: $(basename "$0") staging [branch]"
    echo "       $(basename "$0") production"
    exit 1
    ;;
esac

cd "${TREE}"

# A checkout overwrites tracked files, so local edits to them are about to be
# lost. Untracked files are left alone by a checkout, and both trees hold one
# that belongs there -- .env.staging, .env.production -- so they are not
# counted.
if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
  echo "Tracked files have been edited in ${TREE}. Deal with those first:"
  git status --short --untracked-files=no
  exit 1
fi

previous_branch=$(git rev-parse --abbrev-ref HEAD)
previous_commit=$(git rev-parse --short HEAD)

echo "Deploying ${environment}"
echo "  tree:     ${TREE}"
echo "  node:     $(node --version) (from $(command -v node))"
echo "  current:  ${previous_branch} at ${previous_commit}"
echo "  rollback: sudo git -C ${TREE} checkout ${previous_commit}"
echo

git fetch --quiet --prune origin

branch="${2:-}"

if [ "${CHOOSE_BRANCH}" = "no" ]; then
  if [ -n "${branch}" ]; then
    echo "Production deploys main. To put anything else on it, check the tree"
    echo "out by hand and deploy that -- the extra step is deliberate."
    exit 1
  fi
  branch=main
fi

if [ -z "${branch}" ]; then
  # No credentials: the repository is public. Node parses the response because
  # Node is already on the PATH and jq may not be installed.
  prs=$(node --input-type=module -e '
    const url =
      "https://api.github.com/repos/'"${REPO}"'/pulls?state=open&per_page=50"
    try {
      const res = await fetch(url, {
        headers: { "user-agent": "dchp3-deploy" },
      })
      if (!res.ok) process.exit(1)
      for (const pr of await res.json()) {
        console.log([pr.number, pr.head.ref, pr.title].join("\t"))
      }
    } catch {
      process.exit(1)
    }
  ' 2>/dev/null) || prs=""

  echo "What would you like to deploy?"
  echo
  echo "   0) main"

  n=0
  declare -a refs=("main")
  while IFS=$'\t' read -r number ref title; do
    [ -z "${ref}" ] && continue
    n=$((n + 1))
    refs+=("${ref}")
    printf "  %2d) %-42s #%s %s\n" "${n}" "${ref}" "${number}" "${title}"
  done <<< "${prs}"

  if [ "${n}" -eq 0 ]; then
    echo
    echo "  (no open pull requests found, or GitHub could not be reached)"
  fi

  echo
  read -r -p "Number, or a branch name: " choice

  if [[ "${choice}" =~ ^[0-9]+$ ]] && [ "${choice}" -le "${n}" ]; then
    branch="${refs[${choice}]}"
  elif [ -n "${choice}" ]; then
    branch="${choice}"
  else
    echo "Nothing chosen. Aborted."
    exit 1
  fi
fi

if ! git rev-parse --verify --quiet "origin/${branch}" >/dev/null; then
  echo "No branch called '${branch}' on origin. Aborted."
  exit 1
fi

target=$(git rev-parse --short "origin/${branch}")

echo
echo "  deploying: ${branch} at ${target}"
if [ "${target}" = "${previous_commit}" ]; then
  echo "             (already what is deployed)"
fi
echo

read -r -p "Pull, install, build and restart ${environment}? [y/N] " reply
case "${reply}" in
  y | Y) ;;
  *)
    echo "Aborted."
    exit 1
    ;;
esac

# -B rather than checkout-then-pull: it lands exactly on the remote branch
# whether or not a local one exists and whether or not it has diverged. Neither
# tree is somewhere to keep local commits.
git checkout -B "${branch}" "origin/${branch}"

npm ci --include=dev
npx prisma generate
npm run build

# No `|| true` anywhere below. A restart that fails, or a site that does not
# answer afterwards, is exactly what this is here to notice.
systemctl restart "${UNIT}"

sleep 5
curl -fsS -o /dev/null "http://localhost:${PORT}/"

echo
echo "${environment} is serving on :${PORT}"
echo "  branch:   $(git rev-parse --abbrev-ref HEAD)"
echo "  commit:   $(git rev-parse --short HEAD) $(git log -1 --format=%s)"
