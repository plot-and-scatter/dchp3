#!/usr/bin/bash
# Deploy the staging instance. Run by hand, watched.
#
# With no argument it lists the open pull requests and asks which to deploy,
# because that is what staging is for: trying a branch before it reaches main.
# Give it a branch name to skip the menu, or `main` for the obvious case.
#
# Install this to /usr/local/sbin, NOT the deployed tree. It rewrites that tree
# while running, and bash reads a script as it goes, so a script running from
# inside the tree can be replaced underneath itself mid-deploy.
#
# Serving is start-staging.sh's job. This is the only thing that installs or
# builds.

set -euo pipefail
export PATH=/opt/node-v22.23.2-linux-x64/bin:${PATH}

readonly TREE=/var/www/dchp3-staging
readonly PORT=8081
readonly REPO=plot-and-scatter/dchp3

cd "${TREE}"

# A checkout overwrites tracked files, so local edits to them are about to be
# lost. Stop rather than take that decision for somebody.
#
# --untracked-files=no because a checkout leaves untracked files alone, and the
# tree legitimately contains one: .env.staging, which is not in the repository
# and must not be. Without this the guard refused every deploy.
if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
  echo "Tracked files have been edited in ${TREE}. Deal with those first:"
  git status --short --untracked-files=no
  exit 1
fi

previous_branch=$(git rev-parse --abbrev-ref HEAD)
previous_commit=$(git rev-parse --short HEAD)

echo "Staging deploy"
echo "  tree:     ${TREE}"
echo "  node:     $(node --version) (from $(command -v node))"
echo "  current:  ${previous_branch} at ${previous_commit}"
echo "  rollback: sudo git -C ${TREE} checkout ${previous_commit}"
echo

git fetch --quiet --prune origin

branch="${1:-}"

if [ -z "${branch}" ]; then
  # The repository is public, so this needs no credentials. Node does the
  # parsing because it is already on the PATH and jq may not be installed.
  prs=$(node --input-type=module -e '
    const url =
      "https://api.github.com/repos/'"${REPO}"'/pulls?state=open&per_page=50"
    try {
      const res = await fetch(url, {
        headers: { "user-agent": "dchp3-deploy-staging" },
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

read -r -p "Pull, install, build and restart staging? [y/N] " reply
case "${reply}" in
  y | Y) ;;
  *)
    echo "Aborted."
    exit 1
    ;;
esac

# -B rather than checkout-then-pull: it lands exactly on the remote branch
# whether or not a local one exists, and whether or not it has diverged. The
# staging tree is not somewhere to keep local commits.
git checkout -B "${branch}" "origin/${branch}"

npm ci --include=dev
npx prisma generate
npm run build

# No `|| echo`: a restart that fails is the failure staging exists to catch,
# and swallowing it once left a deploy reporting success while nothing came
# back.
systemctl restart dchp3-staging

sleep 5
curl -fsS -o /dev/null "http://localhost:${PORT}/"

echo
echo "Staging is serving on :${PORT}"
echo "  branch:   $(git rev-parse --abbrev-ref HEAD)"
echo "  commit:   $(git rev-parse --short HEAD) $(git log -1 --format=%s)"
