#!/usr/bin/bash
# Serve the EXISTING build of one archive edition (dchp1 or dchp2). Like
# start-production.sh: never installs, never builds, so the boot unit can run
# it unattended. deploy.sh <edition> is what installs and builds.
#
# Run by dchp3-archive@.service with the edition as the instance name.
set -euo pipefail
export PATH=/opt/node-v22.23.4-linux-x64/bin:${PATH}

edition="${1:-}"
case "${edition}" in
  dchp1 | dchp2) ;;
  *)
    echo "Usage: $(basename "$0") dchp1 | dchp2"
    exit 1
    ;;
esac

cd "/var/www/dchp3-${edition}"
# DCHP_EDITION, DCHP_BASENAME, DATABASE_URL, PORT, IMAGE_BUCKET_PREFIX and
# the secrets; see docs/editions.md.
set -a
# shellcheck disable=SC1090
source ".env.${edition}"
set +a
exec npx react-router-serve ./build/server/index.js
