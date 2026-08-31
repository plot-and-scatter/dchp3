#!/usr/bin/env bash
# refresh-local-db.sh — replace the local `dchp3` database with a copy of the
# production `dchpca_dchp_3` schema.
#
# The local database has diverged from production, so local development and
# tests run against data that does not match the real thing. This restores the
# match.
#
# Runs on a development machine, never on the server. It reads from production
# but never writes to it: the fetch path is `sudo cat` on an existing backup
# file, and the --live path is a `--single-transaction` mysqldump, which takes
# no locks.
#
# Usage:
#   scripts/local/refresh-local-db.sh                  # newest nightly backup
#   scripts/local/refresh-local-db.sh --live           # fresh dump instead
#   scripts/local/refresh-local-db.sh --file dump.gz   # a file already on disk
#   scripts/local/refresh-local-db.sh --yes            # skip the confirmation
#
# See scripts/local/README.md.

set -euo pipefail

SSH_TARGET=${SSH_TARGET:-dchpadm@dchp.arts.ubc.ca}
PROD_SCHEMA=${PROD_SCHEMA:-dchpca_dchp_3}
LOCAL_SCHEMA=${LOCAL_SCHEMA:-dchp3}
LOCAL_CHARSET=${LOCAL_CHARSET:-}  # empty = take it from the dump
BACKUP_DIR=${BACKUP_DIR:-$HOME/dchp3-local-db-backups}
PROD_READ_USER=${PROD_READ_USER:-dchpca_user}

source_mode=backup
dump_file=""
assume_yes=0
keep_download=0

die() {
  echo "error: $*" >&2
  exit 1
}

while [ $# -gt 0 ]; do
  case "$1" in
  --live) source_mode=live ;;
  --file)
    source_mode=file
    dump_file=${2:-}
    [ -n "$dump_file" ] || die "--file needs a path"
    shift
    ;;
  --yes | -y) assume_yes=1 ;;
  --keep-download) keep_download=1 ;;
  -h | --help)
    sed -n '2,22p' "$0"
    exit 0
    ;;
  *) die "unknown argument: $1" ;;
  esac
  shift
done

# --- Guards -----------------------------------------------------------------

command -v mysql >/dev/null || die "mysql client not found on PATH"
command -v mysqldump >/dev/null || die "mysqldump not found on PATH"

# Refuse to touch anything that is not a local database. This script drops a
# schema; pointing it at a remote host by way of a stray environment variable
# must not be possible.
if [ -f .env ]; then
  active_url=$(grep -E '^\s*DATABASE_URL=' .env | tail -1 || true)
  case "$active_url" in
  *127.0.0.1* | *localhost*) : ;;
  "") echo "warning: no active DATABASE_URL found in .env; continuing" ;;
  *) die "the active DATABASE_URL in .env is not local — refusing to run" ;;
  esac
fi

mysql -u root -h 127.0.0.1 -e "SELECT 1" >/dev/null 2>&1 ||
  die "cannot connect to local MySQL as root on 127.0.0.1 (is it running?)"

# --- Confirmation -----------------------------------------------------------

if [ "$assume_yes" -eq 0 ]; then
  echo "This will DROP the local \`$LOCAL_SCHEMA\` database and replace it with"
  echo "production's \`$PROD_SCHEMA\`. The current local database is dumped to"
  echo "$BACKUP_DIR first."
  printf "Continue? [y/N] "
  read -r reply
  case "$reply" in
  y | Y | yes | YES) : ;;
  *) die "cancelled" ;;
  esac
fi

# --- Obtain a dump ----------------------------------------------------------

workdir=$(mktemp -d)
cleanup() {
  if [ "$keep_download" -eq 1 ] && [ -f "$workdir/production.sql.gz" ]; then
    mv "$workdir/production.sql.gz" "./production-dump-$(date +%Y-%m-%d).sql.gz"
    echo "kept downloaded dump: ./production-dump-$(date +%Y-%m-%d).sql.gz"
  fi
  rm -rf "$workdir"
}
trap cleanup EXIT

# Two facts shape this. The server uses password authentication, so every ssh
# invocation prompts; and sudo needs a TTY, but a TTY translates newlines and
# would corrupt a gzip stream piped through it. So: one multiplexed connection
# for a single password prompt, sudo used only for a command whose output is
# text, and the dump itself moved by scp, which is binary-safe.

ssh_mux=""
ssh_opts=()
open_connection() {
  ssh_mux="$workdir/cm"
  echo "Connecting to $SSH_TARGET (one password prompt for the whole run)..."
  if ssh -o ControlMaster=yes -o ControlPath="$ssh_mux" \
    -o ControlPersist=600 -fN "$SSH_TARGET" 2>/dev/null; then
    ssh_opts=(-o ControlPath="$ssh_mux")
  else
    # Older ssh, or multiplexing refused. Still works, just prompts each time.
    echo "note: connection multiplexing unavailable; expect a prompt per step"
    ssh_mux=""
    ssh_opts=()
  fi
}
close_connection() {
  [ -n "$ssh_mux" ] && ssh "${ssh_opts[@]}" -O exit "$SSH_TARGET" 2>/dev/null || true
}

case "$source_mode" in
file)
  [ -f "$dump_file" ] || die "no such file: $dump_file"
  cp "$dump_file" "$workdir/production.sql.gz"
  ;;
backup)
  open_connection
  trap 'close_connection; cleanup' EXIT
  echo "Staging the newest nightly backup (sudo password follows)..."
  # /var/backups is root-only. Copy the newest file somewhere dchpadm can read,
  # and echo its original name. Output is text, so the TTY is harmless here.
  remote_tmp="/tmp/dchp3-refresh-$$.sql.gz"
  original=$(ssh -t "${ssh_opts[@]}" "$SSH_TARGET" \
    "sudo sh -c 'f=\$(ls -1t /var/backups/all-databases-*.sql.gz | head -1);
       [ -n \"\$f\" ] || exit 1;
       cp \"\$f\" $remote_tmp && chmod 600 $remote_tmp &&
       chown \$(id -un) $remote_tmp && echo \"\$f\"'" |
    tr -d '\r' | tail -1)
  [ -n "$original" ] || die "could not stage a backup file on the server"
  echo "Staged $original"
  echo "Downloading..."
  scp "${ssh_opts[@]}" -q "$SSH_TARGET:$remote_tmp" "$workdir/production.sql.gz" ||
    die "scp failed"
  ssh "${ssh_opts[@]}" "$SSH_TARGET" "rm -f $remote_tmp" || true
  ;;
live)
  open_connection
  trap 'close_connection; cleanup' EXIT
  echo "Dumping $PROD_SCHEMA on the server (no locks, read-only)..."
  remote_tmp="/tmp/dchp3-refresh-$$.sql.gz"
  # -t so the MySQL password prompt is usable; the dump goes to a file on the
  # server rather than through the TTY, so nothing binary crosses it.
  ssh -t "${ssh_opts[@]}" "$SSH_TARGET" \
    "umask 077 && mysqldump -u $PROD_READ_USER -p --single-transaction \
       --routines --triggers --databases $PROD_SCHEMA | gzip > $remote_tmp" ||
    die "the remote mysqldump failed"
  echo "Downloading..."
  scp "${ssh_opts[@]}" -q "$SSH_TARGET:$remote_tmp" "$workdir/production.sql.gz" ||
    die "scp failed"
  ssh "${ssh_opts[@]}" "$SSH_TARGET" "rm -f $remote_tmp" || true
  ;;
esac

[ -s "$workdir/production.sql.gz" ] || die "the dump came back empty"
gzip -t "$workdir/production.sql.gz" 2>/dev/null ||
  die "the downloaded file is not valid gzip"
gzip -dc "$workdir/production.sql.gz" | tail -5 | grep -q "Dump completed" ||
  die "the dump has no completion marker — it is truncated, refusing to load it"

# --- Extract the one schema -------------------------------------------------

# The nightly backup holds every schema on the box. Take only the section for
# $PROD_SCHEMA, and drop its CREATE DATABASE / USE lines so the rows land in
# the locally-named database instead of recreating production's name.
echo "Extracting \`$PROD_SCHEMA\` ..."
gzip -dc "$workdir/production.sql.gz" |
  awk -v schema="$PROD_SCHEMA" '
    $0 ~ "^-- Current Database: `" schema "`$" { inside = 1; next }
    /^-- Current Database: `/ { inside = 0 }
    inside && /^CREATE DATABASE/ { next }
    inside && /^USE `/ { next }
    inside { print }
  ' >"$workdir/schema.sql"

[ -s "$workdir/schema.sql" ] ||
  die "found no section for \`$PROD_SCHEMA\` in the dump"

# Take the database default charset from production's own CREATE DATABASE line
# rather than assuming one. It governs only tables created later — this repo has
# no Prisma migrations and a no-op seed, so nothing creates tables today — but
# guessing it wrong would quietly plant a difference for whenever that changes.
if [ -z "$LOCAL_CHARSET" ]; then
  LOCAL_CHARSET=$(gzip -dc "$workdir/production.sql.gz" |
    grep -m1 "^CREATE DATABASE.*\`$PROD_SCHEMA\`" |
    sed -n 's/.*DEFAULT CHARACTER SET \([a-z0-9]*\).*/\1/p')
  [ -n "$LOCAL_CHARSET" ] || LOCAL_CHARSET=latin1
  echo "Database default charset from the dump: $LOCAL_CHARSET"
fi

# A dump section that holds no CREATE TABLE is a section header and nothing
# else, which would silently produce an empty database.
grep -q "^CREATE TABLE" "$workdir/schema.sql" ||
  die "the extracted section contains no tables — refusing to load it"

table_count=$(grep -c "^CREATE TABLE" "$workdir/schema.sql")
echo "Found $table_count tables."

# --- Back up what is there now ----------------------------------------------

mkdir -p "$BACKUP_DIR"
safety_copy="$BACKUP_DIR/$LOCAL_SCHEMA-before-refresh-$(date +%Y-%m-%d_%H-%M-%S).sql.gz"
if mysql -u root -h 127.0.0.1 -N -e \
  "SELECT schema_name FROM information_schema.schemata WHERE schema_name='$LOCAL_SCHEMA'" |
  grep -q .; then
  echo "Backing up the current local database to $safety_copy ..."
  mysqldump -u root -h 127.0.0.1 --single-transaction --routines --triggers \
    "$LOCAL_SCHEMA" | gzip >"$safety_copy"
  [ -s "$safety_copy" ] || die "the safety backup is empty — stopping"
else
  echo "No existing \`$LOCAL_SCHEMA\` database; nothing to back up."
  safety_copy=""
fi

# --- Replace ----------------------------------------------------------------

echo "Replacing \`$LOCAL_SCHEMA\` ..."
mysql -u root -h 127.0.0.1 -e \
  "DROP DATABASE IF EXISTS \`$LOCAL_SCHEMA\`;
   CREATE DATABASE \`$LOCAL_SCHEMA\` DEFAULT CHARACTER SET $LOCAL_CHARSET;"

mysql -u root -h 127.0.0.1 "$LOCAL_SCHEMA" <"$workdir/schema.sql"

# --- Report -----------------------------------------------------------------

loaded=$(mysql -u root -h 127.0.0.1 -N -e \
  "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='$LOCAL_SCHEMA'")
entries=$(mysql -u root -h 127.0.0.1 -N -e \
  "SELECT COUNT(*) FROM \`$LOCAL_SCHEMA\`.det_entries" 2>/dev/null || echo "?")

echo
echo "Done. $loaded tables and views in \`$LOCAL_SCHEMA\`; det_entries holds $entries rows."
if [ -n "$safety_copy" ]; then
  echo "Previous local database: $safety_copy"
fi
echo
echo "Run \`npx prisma generate\` if the schema shape changed."
