#!/bin/sh

# This file is how Fly starts the server (configured in fly.toml). Before starting
# the server though, we need to run any prisma migrations that haven't yet been
# run, which is why this file exists in the first place.
# Learn more: https://community.fly.io/t/sqlite-not-getting-setup-properly/4386

# FH added 2024-01-19: This file is only used when running on Fly. To run the
# app on a server that's NOT Fly, use the `start-shell.sh` script.

set -ex
#npx prisma migrate deploy
npm run start
