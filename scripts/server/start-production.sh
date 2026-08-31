#!/usr/bin/bash
# Serve the EXISTING production build. Never installs and never builds, so it
# is safe for the boot unit to run unattended: no npm registry dependency, no
# build-sized memory spike, and a tree that cannot build still comes back up.
#
# Installing and building is deploy-production.sh's job, run by hand.
set -euo pipefail
export PATH=/opt/node-v22.23.2-linux-x64/bin:${PATH}

# The npm script, not a server binary by name, so this serves whichever tree
# is checked out: `remix-serve build` on the tree production runs today,
# `react-router-serve ./build/server/index.js` after the upgrade to main.
cd /var/www/dchp3
exec npm run start-shell
