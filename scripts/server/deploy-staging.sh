#!/usr/bin/bash
# Deploy the staging instance: update the tree, install, build, restart.
# Run by hand, watched. Serving is start-staging.sh's job; this script is
# the only thing that ever installs or builds.
set -euo pipefail
export PATH=/opt/node-v22.23.2-linux-x64/bin:$PATH
cd /var/www/dchp3-staging
git pull --ff-only
npm ci --include=dev
npx prisma generate
npm run build
systemctl restart dchp3-staging 2>/dev/null || echo "unit not installed; start by hand"
