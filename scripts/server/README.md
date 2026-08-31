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

## Production: dchp3-remix-server.service, start-production.sh, deploy-production.sh

The unit keeps its original name, so there is nothing to enable or disable —
only the file contents change.

Unlike staging, production's two scripts install to `/usr/local/sbin` rather
than being run from `scripts/server/` inside the deployed tree. Two reasons:
the deployed tree does not contain these scripts until production is upgraded
to current `main`, and the deploy script rewrites that tree while the unit
that points into it is running.

### Installation

1. Copy both scripts in, root-only:

   ```
   sudo curl -fL -o /usr/local/sbin/dchp3-start-production.sh \
     https://raw.githubusercontent.com/plot-and-scatter/dchp3/main/scripts/server/start-production.sh
   sudo curl -fL -o /usr/local/sbin/dchp3-deploy-production.sh \
     https://raw.githubusercontent.com/plot-and-scatter/dchp3/main/scripts/server/deploy-production.sh
   sudo chown root:root /usr/local/sbin/dchp3-*-production.sh
   sudo chmod 700 /usr/local/sbin/dchp3-*-production.sh
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

### Deploying after this

`sudo /usr/local/sbin/dchp3-deploy-production.sh`, watched. It prints the
current commit and the command to roll back to it before doing anything, and
asks for confirmation (`-y` skips the prompt).

Both production scripts pin `PATH` at the Node 22 tarball in `/opt`, exactly
as the staging scripts do; the system Node stays at 18 and nothing else on
the box is affected. Read the header of the deploy script before its first
run: as long as the deployed tree predates PR #424, that first deploy is also
production's move to current `main`. That is a scheduled window, not a
routine deploy.

## Staging: dchp3-staging.service, start-staging.sh, deploy-staging.sh

The same design, proven on staging first (2026-08-28). Staging runs from
`/var/www/dchp3-staging` on port 8081, serves out of `scripts/server/` in its
own tree, and reads `.env.staging`. Its unit is enabled at boot, which is
safe precisely because the start script only serves.
