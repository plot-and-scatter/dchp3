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
