#!/usr/bin/bash
# dchp3-mysql-backup.sh — nightly MySQL backup, and the source for staging
# database refreshes. Runs as root from root's crontab; see README.md in this
# directory for installation.
#
# Credentials come from /root/.my.cnf (mode 600), never from this file.
set -u

backupfolder=/var/backups
recipient=frank@plotandscatter.com
keep=30 # number of backups to retain

fail() {
  echo "$1" | mailx -s 'DCHP-3: BACKUP FAILED' "$recipient"
  exit 1
}

# Rotate FIRST, so a full disk can never block cleanup. Counts backups rather
# than aging them, so a stalled schedule cannot delete the last copies.
ls -1t "$backupfolder"/all-databases-*.sql.gz 2>/dev/null |
  tail -n +$((keep + 1)) | xargs -r rm -f

stamp=$(date +%Y-%m-%d_%H-%M-%S)
outfile=$backupfolder/all-databases-$stamp.sql.gz

# Back up every schema except the staging mirrors: they are rebuilt from
# production on demand and hold nothing production's own backup does not.
# Without this, each nightly backup carries a second copy of the dictionary.
# information_schema and performance_schema are excluded because
# --all-databases skips them too; sys is kept for the same reason.
databases=$(mysql -N -B -e "SELECT schema_name FROM information_schema.schemata
  WHERE schema_name NOT IN ('information_schema','performance_schema')
    AND schema_name NOT LIKE '%\\_staging'") ||
  fail "could not list databases to back up"
[ -n "$databases" ] || fail "database list came back empty"

# Stream the dump straight into gzip: no large intermediate .sql file that
# could be leaked on failure (the bug that filled the disk in the old script).
# --single-transaction: consistent InnoDB snapshot, no table locks on prod.
# $databases is deliberately unquoted: mysqldump wants one argument per
# schema, and schema names here cannot contain whitespace.
# shellcheck disable=SC2086
if ! mysqldump --single-transaction --routines --triggers --events \
  --databases $databases 2>/tmp/dchp3-backup-err | gzip >"$outfile"; then
  rm -f "$outfile"
  fail "mysqldump failed: $(cat /tmp/dchp3-backup-err)"
fi

# A truncated dump is worse than none: mysqldump ends a successful dump with
# a completion marker.
if ! zcat "$outfile" | tail -1 | grep -q "Dump completed"; then
  rm -f "$outfile"
  fail "dump did not complete (no completion marker)"
fi

echo "$outfile ($(du -h "$outfile" | cut -f1))" |
  mailx -s 'DCHP-3: Backup was successfully created' "$recipient"
