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
set -E

# A bare `set -e` exit prints nothing, which once left a run stopping silently
# mid-way. Say where it happened.
trap 'st=$?; [ $st -ne 0 ] && echo "error: unexpected failure (exit $st) near line $LINENO" >&2' ERR

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
remote_tmp=""
remote_name=""
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
remote_cleanup() {
  [ -n "${remote_tmp:-}${remote_name:-}" ] || return 0
  ssh ${ssh_opts[@]+"${ssh_opts[@]}"} "$SSH_TARGET" \
    "rm -f ${remote_tmp:-} ${remote_name:-}" 2>/dev/null || true
}
close_connection() {
  [ -n "$ssh_mux" ] && ssh ${ssh_opts[@]+"${ssh_opts[@]}"} -O exit "$SSH_TARGET" 2>/dev/null || true
}

case "$source_mode" in
file)
  [ -f "$dump_file" ] || die "no such file: $dump_file"
  cp "$dump_file" "$workdir/production.sql.gz"
  ;;
backup)
  open_connection
  trap 'remote_cleanup; close_connection; cleanup' EXIT
  echo "Staging the newest nightly backup. Enter your sudo password when asked:"
  # This call must NOT be captured. With -t, sudo's prompt comes back on ssh's
  # stdout, so a command substitution here would swallow the prompt and look
  # like a hang. The filename is written to a file on the server instead and
  # read back by a second, non-interactive call over the same connection.
  remote_tmp="/tmp/dchp3-refresh-$$.sql.gz"
  remote_name="/tmp/dchp3-refresh-$$.name"
  # The two output files are created by the *login* shell, so they belong to
  # the ssh user, and sudo then writes into files that already exist —
  # ownership does not change. An earlier version chowned them with `id -un`
  # inside sudo, which returns root, leaving files the ssh user could not read.
  # The dump is redirected on the server, so nothing binary crosses the TTY
  # that sudo's prompt needs.
  ssh -t ${ssh_opts[@]+"${ssh_opts[@]}"} "$SSH_TARGET" \
    "umask 077; : > $remote_tmp; : > $remote_name;
     sudo sh -c 'f=\$(ls -1t /var/backups/all-databases-*.sql.gz | head -1);
       [ -n \"\$f\" ] || exit 1;
       cat \"\$f\" > $remote_tmp;
       echo \"\$f\" > $remote_name'" ||
    die "could not stage a backup file on the server"

  original=$(ssh ${ssh_opts[@]+"${ssh_opts[@]}"} "$SSH_TARGET" "cat $remote_name" |
    tr -d '\r' | tail -1)
  [ -n "$original" ] || die "the staged file name came back empty"
  size=$(ssh ${ssh_opts[@]+"${ssh_opts[@]}"} "$SSH_TARGET" "du -h $remote_tmp | cut -f1" |
    tr -d '\r' | tail -1)
  echo "Staged $original ($size). Downloading:"
  # No -q: scp's progress meter is the only feedback during the transfer.
  scp ${ssh_opts[@]+"${ssh_opts[@]}"} "$SSH_TARGET:$remote_tmp" "$workdir/production.sql.gz" ||
    die "scp failed"
  ;;
live)
  open_connection
  trap 'remote_cleanup; close_connection; cleanup' EXIT
  echo "Dumping $PROD_SCHEMA on the server (no locks, read-only)..."
  remote_tmp="/tmp/dchp3-refresh-$$.sql.gz"
  # -t so the MySQL password prompt is usable; the dump goes to a file on the
  # server rather than through the TTY, so nothing binary crosses it.
  ssh -t ${ssh_opts[@]+"${ssh_opts[@]}"} "$SSH_TARGET" \
    "umask 077 && mysqldump -u $PROD_READ_USER -p --single-transaction \
       --routines --triggers --databases $PROD_SCHEMA | gzip > $remote_tmp" ||
    die "the remote mysqldump failed"
  echo "Downloading:"
  scp ${ssh_opts[@]+"${ssh_opts[@]}"} "$SSH_TARGET:$remote_tmp" "$workdir/production.sql.gz" ||
    die "scp failed"
  ;;
esac

[ -s "$workdir/production.sql.gz" ] || die "the dump came back empty"
gzip -t "$workdir/production.sql.gz" 2>/dev/null ||
  die "the downloaded file is not valid gzip"
# `... | grep -q` would exit on the match and leave the writer with SIGPIPE,
# which `pipefail` reports as failure. Read the tail first, then test it.
dump_tail=$(gzip -dc "$workdir/production.sql.gz" | tail -5)
case "$dump_tail" in
*"Dump completed"*) : ;;
*) die "the dump has no completion marker — it is truncated, refusing to load it" ;;
esac

# --- Extract the one schema -------------------------------------------------

# The nightly backup holds every schema on the box. Take only the section for
# $PROD_SCHEMA, and drop its CREATE DATABASE / USE lines so the rows land in
# the locally-named database instead of recreating production's name.
echo "Extracting \`$PROD_SCHEMA\` ..."
gzip -dc "$workdir/production.sql.gz" |
  awk -v schema="$PROD_SCHEMA" -v charsetfile="$workdir/charset" \
      -v preamble="$workdir/preamble.sql" '
    # Everything before the first schema marker is mysqldump session setup:
    # SET NAMES, and crucially FOREIGN_KEY_CHECKS=0, without which the tables
    # fail to load in the order the dump writes them.
    !seen && /^-- Current Database: `/ { seen = 1 }
    !seen { print > preamble; next }
    $0 ~ "^-- Current Database: `" schema "`$" { inside = 1; next }
    /^-- Current Database: `/ { inside = 0 }
    inside && /^CREATE DATABASE/ {
      if (match($0, /DEFAULT CHARACTER SET [a-zA-Z0-9_]+/)) {
        split(substr($0, RSTART, RLENGTH), parts, " ")
        print parts[5] > charsetfile
      }
      next
    }
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
  LOCAL_CHARSET=$(head -1 "$workdir/charset" 2>/dev/null || true)
  [ -n "$LOCAL_CHARSET" ] || LOCAL_CHARSET=latin1
  echo "Database default charset from the dump: $LOCAL_CHARSET"
fi

# A dump section that holds no CREATE TABLE is a section header and nothing
# else, which would silently produce an empty database.
grep -q "^CREATE TABLE" "$workdir/schema.sql" ||
  die "the extracted section contains no tables — refusing to load it"

grep -q "FOREIGN_KEY_CHECKS=0" "$workdir/preamble.sql" 2>/dev/null ||
  die "the dump preamble has no FOREIGN_KEY_CHECKS=0 — the load would fail on
table order; check that this is a mysqldump file"

table_count=$(grep -c "^CREATE TABLE" "$workdir/schema.sql")
echo "Found $table_count tables."

# --- Make the schema loadable on MySQL 8.4+ ---------------------------------

# Production's `det_entries` has a composite primary key, `(id, headword)`, and
# five foreign keys reference `det_entries(id)` on its own. MySQL 8.0 allowed a
# foreign key to reference a non-unique index; 8.4 removed that, so on a newer
# local server the load fails with "Missing unique key for constraint".
#
# The fix is an extra UNIQUE KEY on the referenced column. It is safe precisely
# because that column is AUTO_INCREMENT, so its values are already unique — the
# index adds a constraint the data already satisfies, and every foreign key,
# including its ON DELETE CASCADE, survives intact. The alternative, dropping
# the foreign keys locally, would silently change how deletes behave here
# compared with production.
local_version=$(mysql -u root -h 127.0.0.1 -N -e "SELECT VERSION()" | cut -d. -f1,2)
local_major=${local_version%%.*}
local_minor=${local_version#*.}
if [ "$local_major" -gt 8 ] || { [ "$local_major" -eq 8 ] && [ "$local_minor" -ge 4 ]; }; then
  echo "Local MySQL is $local_version; adding unique keys the newer foreign-key rules require..."
  awk '
    /^CREATE TABLE `/ { delete autoinc }
    /^  `[^`]+` / {
      col = $1; gsub(/`/, "", col)
      if ($0 ~ /AUTO_INCREMENT/) autoinc[col] = 1
    }
    /^  PRIMARY KEY \(/ {
      line = $0
      inner = line
      sub(/^  PRIMARY KEY \(/, "", inner)
      sub(/\).*$/, "", inner)
      n = split(inner, cols, ",")
      first = cols[1]; gsub(/`/, "", first)
      if (n > 1 && (first in autoinc)) {
        # Keep the comma structure valid whether or not the primary key was
        # the last element in the table definition.
        if (line ~ /,$/) {
          print line
        } else {
          print line ","
        }
        printf "  UNIQUE KEY `mysql84_fk_compat_%s` (`%s`)%s\n", \
          first, first, (line ~ /,$/ ? "," : "")
        next
      }
    }
    { print }
  ' "$workdir/schema.sql" >"$workdir/schema.patched.sql"
  mv "$workdir/schema.patched.sql" "$workdir/schema.sql"
fi

# --- Back up what is there now ----------------------------------------------

mkdir -p "$BACKUP_DIR"
safety_copy="$BACKUP_DIR/$LOCAL_SCHEMA-before-refresh-$(date +%Y-%m-%d_%H-%M-%S).sql.gz"
if mysql -u root -h 127.0.0.1 -N -e \
  "SELECT schema_name FROM information_schema.schemata WHERE schema_name='$LOCAL_SCHEMA'" |
  grep -q .; then
  echo "Backing up the current local database (no output while it runs)..."
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

echo "Loading (no output until it finishes; a full dictionary takes a minute)..."
cat "$workdir/preamble.sql" "$workdir/schema.sql" |
  mysql -u root -h 127.0.0.1 "$LOCAL_SCHEMA"

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
