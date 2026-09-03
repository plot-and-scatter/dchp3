# Server scripts

Scripts that run on the production server (`dchp.arts.ubc.ca`), versioned
here so they cannot exist only on the box. Deploying a change means copying
the file to the server — nothing does this automatically.

## dchp3-mysql-backup.sh

Nightly backup of all MySQL databases to `/var/backups`, and the source for
staging database refreshes. Replaces an older backup script.

### Installation

1. Put the MySQL root credentials in `/root/.my.cnf` so no password appears
   in the script or the process list:

   ```
   sudo touch /root/.my.cnf && sudo chmod 600 /root/.my.cnf
   ```

   Then edit it (as root) to contain:

   ```ini
   [client]
   user=root
   password=<the MySQL root password>
   ```

2. Copy the script into place, root-only:

   ```
   sudo cp dchp3-mysql-backup.sh /usr/local/sbin/
   sudo chown root:root /usr/local/sbin/dchp3-mysql-backup.sh
   sudo chmod 700 /usr/local/sbin/dchp3-mysql-backup.sh
   ```

3. Run it once by hand and confirm the success email arrives:

   ```
   sudo /usr/local/sbin/dchp3-mysql-backup.sh
   ```

4. Schedule it in root's crontab (`sudo crontab -e`). 02:15 sits clear of the
   01:30 inventory job and finishes well before the 03:28 nightly reboot:

   ```
   15 2 * * * /usr/local/sbin/dchp3-mysql-backup.sh
   ```

5. Remove any copy of the previous backup script once the new one has run
   successfully.

### Behaviour

- Rotation runs **before** the dump and keeps the newest 30 backups by
  count (~16 MB each, ~500 MB total), so a full disk can never block cleanup
  and a stalled schedule cannot age out the last copies.
- The dump streams through gzip; no uncompressed `.sql` is written.
- `--single-transaction` takes a consistent InnoDB snapshot without locking
  production tables.
- Any failure deletes the partial file and emails
  `DCHP-3: BACKUP FAILED`; success emails
  `DCHP-3: Backup was successfully created` with the file path and size.
- A dump missing mysqldump's completion marker is treated as a failure
  (catches truncated dumps, which otherwise look valid).

### Restoring / staging refresh

```
zcat /var/backups/all-databases-<stamp>.sql.gz | mysql
```

For the staging refresh (single schema into the staging database), see the
staging setup notes.

## Before upgrading MySQL

The database server cannot be upgraded past **MySQL 8.4** without checking the
schema first. MySQL 8.0 allows a foreign key to reference a non-unique index;
8.4 removed that, and a dump containing such a constraint fails to restore with:

```
ERROR 6125 (HY000): Failed to add the foreign key constraint.
Missing unique key for constraint '<name>' in the referenced table '<table>'
```

This was live in this database: `det_entries` had a composite primary key
`(id, headword)` and five foreign keys referencing `det_entries(id)` alone.
Resolved on 2026-08-31 by adding a unique key, which is semantically a no-op
because the column is `AUTO_INCREMENT`:

```sql
ALTER TABLE det_entries ADD UNIQUE KEY det_entries_unique_id (id),
  ALGORITHM=INPLACE, LOCK=NONE;
```

Two things follow:

- **Backups taken before that date still carry the old schema.** Restoring one
  into 8.4 or newer needs the same fix applied afterwards, or the workaround in
  `scripts/local/refresh-local-db.sh`, which adds the key during the load.
- **Check for the same pattern before any future upgrade**, in case another
  table acquires it. The query below lists foreign keys whose referenced column
  has no single-column unique index:

```sql
SELECT k.TABLE_NAME, k.CONSTRAINT_NAME,
       k.REFERENCED_TABLE_NAME, k.REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE k
WHERE k.REFERENCED_TABLE_NAME IS NOT NULL
  AND k.TABLE_SCHEMA = DATABASE()
  AND NOT EXISTS (
    SELECT 1 FROM information_schema.STATISTICS s
    WHERE s.TABLE_SCHEMA = k.TABLE_SCHEMA
      AND s.TABLE_NAME = k.REFERENCED_TABLE_NAME
      AND s.COLUMN_NAME = k.REFERENCED_COLUMN_NAME
      AND s.NON_UNIQUE = 0 AND s.SEQ_IN_INDEX = 1
      AND (SELECT COUNT(*) FROM information_schema.STATISTICS s2
           WHERE s2.TABLE_SCHEMA = s.TABLE_SCHEMA
             AND s2.TABLE_NAME = s.TABLE_NAME
             AND s2.INDEX_NAME = s.INDEX_NAME) = 1);
```

An empty result means the schema will restore into 8.4+.

Run that query **on the server**, on 8.0. A newer server cannot be in this
state — it refuses to create such a constraint in the first place, with the
error above — so the check is only meaningful where the schema was built.

## The split deploy/start design

Both the production and staging instances follow the same two-script shape:

- **`deploy-*.sh`** — run by hand and watched. Pulls, installs, builds,
  restarts. The only thing that ever installs or builds.
- **`start-*.sh`** — what systemd runs. Serves the build that is already on
  disk. Never installs, never builds.

The reason is that production's original single script did all four steps at
every boot, and the box reboots nightly at 03:28. That made every night an
unattended reinstall and rebuild of production: ~80s of downtime, a hard
dependency on the npm registry being reachable at 3am, and a tree that failed
to build discovered at 3am rather than at deploy time. It also ran `npm i` as
root nightly, which is what grew root's npm cache to 4.3 GB and filled the
root partition in April 2025.

With the split, a boot serves the existing build in seconds and deploys
happen only when someone runs the deploy script and watches it.

## Production: dchp3-remix-server.service, start-production.sh

The unit keeps its original name, so there is nothing to enable or disable —
only the file contents change.

`start-production.sh` installs to `/usr/local/sbin` rather than running from
the deployed tree, so that a tree which fails to build can still be served from
a script that does not depend on it. The deploy script goes there for a
stronger reason; see "Installing the deploy script" below.

### Installation

1. Copy the start script in, root-only. The deploy script is shared with
   staging and is installed separately, below.

   ```
   sudo curl -fL -o /usr/local/sbin/dchp3-start-production.sh \
     https://raw.githubusercontent.com/plot-and-scatter/dchp3/main/scripts/server/start-production.sh
   sudo chown root:root /usr/local/sbin/dchp3-start-production.sh
   sudo chmod 700 /usr/local/sbin/dchp3-start-production.sh
   ```

2. Prove the start script by hand before the unit depends on it. This is the
   only step with downtime — seconds:

   ```
   sudo systemctl stop dchp3-remix-server
   sudo bash /usr/local/sbin/dchp3-start-production.sh
   ```

   In a second shell, `curl -sS -o /dev/null -w '%{http_code}\n' http://localhost:3000/` should print `200`. Then Ctrl-C the script.

3. Install the unit and restart:

   ```
   sudo curl -fL -o /etc/systemd/system/dchp3-remix-server.service \
     https://raw.githubusercontent.com/plot-and-scatter/dchp3/main/scripts/server/dchp3-remix-server.service
   sudo systemctl daemon-reload
   sudo systemctl restart dchp3-remix-server
   sudo systemctl status dchp3-remix-server
   ```

   Keep a copy of the previous unit file first. Rolling back is restoring it
   and running `daemon-reload` and `restart` — the old `start-shell.sh` stays
   in the tree untouched, so nothing else has to be undone.

4. Confirm the next morning that the 03:28 reboot brought the site back, and
   that the journal for the unit shows a start of seconds with no `npm i`.

### Before a deploy that brings new environment variables

`.env.production` and `.env.staging` are not in the repository and the deploy
script does not touch them, so a variable added in code has to be added on the
server by hand **before** the deploy that needs it.

The failure is quiet when this is missed. The site starts, serves every page,
and passes the deploy script's own health check; only the feature that needed
the variable fails, and only when somebody opens it.

Currently outstanding: `AUTH0_MGMT_CLIENT_ID` and `AUTH0_MGMT_CLIENT_SECRET`,
for user management. Both belong to the Auth0 Machine-to-Machine application,
which is a different application from the one the login flow uses — see
`.env.example` for the distinction and the scopes it needs, and
`docs/auth/user-management.md` for what depends on them.

To check what a server has before deploying, without printing any values:

```
sudo grep -c AUTH0_MGMT_CLIENT_ID /var/www/dchp3/.env.production
```

`1` means it is set. `0` means the deploy will appear to work and
`/admin/users` will not.

### Deploying

One script, both environments:

```
sudo dchp3-deploy staging
sudo dchp3-deploy production
```

It prints the current commit and the command to roll back to it before making
any change, refuses to run over edited tracked files, asks for confirmation,
and checks the site answers afterwards. **Read the last two lines**, which name
the branch and commit it ended on. A deploy that quietly stayed on the wrong
branch otherwise looks exactly like one that worked, which has happened.

**Staging asks which branch**, listing the open pull requests, because trying a
branch before it reaches `main` is what staging is for. `0` is `main`, a branch
name can be typed instead of a number, and one can be passed as an argument to
skip the menu:

```
sudo dchp3-deploy staging feature/some-branch
```

The list comes from the GitHub API without credentials, the repository being
public. If GitHub cannot be reached the menu still offers `main` and still
accepts a branch name typed by hand.

**Production deploys `main` and nothing else.** Putting anything else on it
means checking the tree out by hand first; the extra step is the point.

### Installing the deploy script

**It goes in `/usr/local/sbin`, not in either deployed tree.** It rewrites the
tree while running, and bash reads a script as it goes, so a copy running from
inside the tree can be replaced underneath itself part-way through.

```
sudo curl -fL -o /usr/local/sbin/dchp3-deploy \
  https://raw.githubusercontent.com/plot-and-scatter/dchp3/main/scripts/server/deploy.sh
sudo chown root:root /usr/local/sbin/dchp3-deploy
sudo chmod 700 /usr/local/sbin/dchp3-deploy
```

Re-copy it whenever the script changes; a deploy updates the tree's copy and
not this one. If `sudo dchp3-deploy` says the command is not found, sudo's
`secure_path` does not include `/usr/local/sbin`, and the full path works.

The two earlier scripts, `deploy-production.sh` and `deploy-staging.sh`, are
replaced by this one. Delete them from `/usr/local/sbin` once it is in place.

## Staging: dchp3-staging.service, start-staging.sh

The same design, proven on staging first (2026-08-28). Staging runs from
`/var/www/dchp3-staging` on port 8081 and reads `.env.staging`. Its unit is
enabled at boot, which is safe precisely because the start script only serves.

`start-staging.sh` runs from the deployed tree, which is fine: it only serves.
