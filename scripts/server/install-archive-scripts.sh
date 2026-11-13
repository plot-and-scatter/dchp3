#!/usr/bin/bash
# Install (or update) the server-side pieces for the archive editions from
# this tree: the shared deploy script, the archive start script and the
# template unit, then enable both archive units. Re-runnable. Run as root:
#
#   sudo bash /var/www/dchp3-dchp1/scripts/server/install-archive-scripts.sh
#
# What each archive still needs besides this: its database, its tree, its
# .env.<edition>, a deploy, and the Apache lines. See docs/editions.md.
set -euo pipefail

here=$(cd "$(dirname "$0")" && pwd)

if [ -f /usr/local/sbin/dchp3-deploy ]; then
  cp /usr/local/sbin/dchp3-deploy /usr/local/sbin/dchp3-deploy.bak
fi
install -o root -g root -m 700 "${here}/deploy.sh" /usr/local/sbin/dchp3-deploy
install -o root -g root -m 700 "${here}/start-archive.sh" /usr/local/sbin/dchp3-start-archive.sh
install -o root -g root -m 644 "${here}/dchp3-archive@.service" /etc/systemd/system/dchp3-archive@.service

systemctl daemon-reload
systemctl enable dchp3-archive@dchp1 dchp3-archive@dchp2

echo "Installed:"
ls -l /usr/local/sbin/dchp3-deploy /usr/local/sbin/dchp3-start-archive.sh /etc/systemd/system/dchp3-archive@.service
systemctl is-enabled dchp3-archive@dchp1 dchp3-archive@dchp2
