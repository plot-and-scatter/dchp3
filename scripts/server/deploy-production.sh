#!/usr/bin/bash
# Deploy production: update the tree, install, build, restart. Run BY HAND and
# watched. This is the only thing that installs or builds; the boot unit only
# serves (start-production.sh).
#
# READ BEFORE FIRST USE. As of 2026-08-31 the deployed tree predates PR #424
# and current main is React Router 7, which needs Node >= 22. The PATH line
# below points at the Node 22 tarball in /opt, so the first run of this script
# is also production's move to current main. That is a deliberate, scheduled
# window -- not a routine deploy. The system Node stays at 18; only these two
# scripts and the tree they build and serve see Node 22.
set -euo pipefail
export PATH=/opt/node-v22.23.2-linux-x64/bin:${PATH}
cd /var/www/dchp3

previous=$(git rev-parse HEAD)
echo "Deploying /var/www/dchp3"
echo "  node:     $(node --version) (from $(command -v node))"
echo "  current:  ${previous}"
echo "  rollback: git -C /var/www/dchp3 checkout ${previous}"
echo

if [ "${1:-}" != "-y" ]; then
  read -r -p "Pull, install, build and restart production? [y/N] " reply
  case "${reply}" in
    y | Y) ;;
    *)
      echo "Aborted."
      exit 1
      ;;
  esac
fi

git pull --ff-only
npm ci --include=dev
npx prisma generate
npm run build
systemctl restart dchp3-remix-server

sleep 5
curl -fsS -o /dev/null http://localhost:3000/ && echo "Production is serving on :3000."
