#!/usr/bin/bash
# Serve the EXISTING staging build. Never installs or builds — safe to run
# from a boot unit. Deploys happen only via deploy-staging.sh.
set -euo pipefail
export PATH=/opt/node-v22.23.2-linux-x64/bin:$PATH
cd /var/www/dchp3-staging
set -a; source .env.staging; set +a
exec npx react-router-serve ./build/server/index.js
