#!/usr/bin/bash

cd /var/www/dchp3

# npm ci, not npm i: install exactly what package-lock.json pins rather than
# re-resolving every ^range at deploy time. CI has installed this way since
# #414, so this is what keeps production and CI on the same dependency tree.
#
# --include=dev is required even in production: the build needs the Remix CLI,
# TypeScript and Tailwind, all devDependencies. Without it, an NODE_ENV of
# production on this box makes `npm run build` fail.
sudo /usr/bin/npm ci --include=dev
sudo /usr/bin/npm run build
sudo /usr/bin/npm run start-shell
