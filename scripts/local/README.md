# Local scripts

Scripts that run on a development machine, not on the server. The server's own
scripts are in `scripts/server/`.

## refresh-local-db.sh

Replaces the local `dchp3` database with a copy of production's
`dchpca_dchp_3`.

### Why

The local database diverged from production some time ago. Local development
and the test suite therefore run against data that does not match the real
dictionary — row counts, entries and user records all differ. This script
resets that.

### Usage

From the repository root:

```
scripts/local/refresh-local-db.sh
```

That takes the newest nightly backup from `/var/backups` on the server. Two
other sources:

```
scripts/local/refresh-local-db.sh --live            # fresh dump of production
scripts/local/refresh-local-db.sh --file dump.sql.gz # a file already on disk
```

Other flags: `--yes` skips the confirmation prompt, `--keep-download` leaves
the downloaded dump in the working directory instead of deleting it.

### What it does, in order

1. Refuses to run unless the active `DATABASE_URL` in `.env` points at
   `127.0.0.1` or `localhost`, and unless local MySQL answers.
2. Asks for confirmation, naming the database it is about to drop.
3. Fetches the dump. The nightly backups are root-only, so both the listing
   and the read go through `sudo` over `ssh -t`, which will prompt for the
   password. Nothing is written on the server.
4. Rejects the dump if it is not valid gzip, or if it lacks mysqldump's
   "Dump completed" marker — a truncated dump loads without error and leaves a
   half-populated database, which is worse than failing.
5. Extracts only the `dchpca_dchp_3` section. A nightly backup contains every
   schema on the box; the `CREATE DATABASE` and `USE` lines are dropped so the
   rows land in the locally-named database. Refuses to continue if that
   section holds no `CREATE TABLE`.
6. Dumps the current local database to `~/dchp3-local-db-backups/` before
   dropping anything, and stops if that safety copy comes back empty.
7. Drops and recreates the local database, then loads the extracted section.
8. Prints the table count and the `det_entries` row count.

### Two things to know

**Character set.** The script reads the database default charset out of
production's own `CREATE DATABASE` line rather than assuming one; override with
`LOCAL_CHARSET` if needed. That default governs only tables created later, and
nothing here creates tables — `prisma/migrations/` holds no migration SQL and
`prisma/seed.ts` is a no-op — so it changes no current behaviour.

**Collation, which does matter.** Table and column collations come from the
dump and replace whatever local had. Several queries sort with
`ORDER BY LOWER(headword)` (`app/models/entry.server.ts`,
`app/models/search/getEntriesByBasicTextSearch.ts`,
`app/models/search/getSearchResultFistNotes.ts`), and collation decides how
accented and uppercase characters sort. So the order of browse and search
results can change after a refresh — toward production's order, which is the
point, but it can move an entry between pages. `cypress/e2e/smoke.cy.ts`
asserts that "Cabbagetown" appears on `/entries/browse/c/1`; if that test
starts failing after a refresh, this is why, and the test is what needs
updating, not the data. The `WHERE BINARY` lookups in `app/models/bank.server.ts`
are collation-independent and unaffected.

**Prisma.** If the production schema shape differs from what
`prisma/schema.prisma` expects, run `npx prisma generate` afterwards. The
script does not run migrations and does not alter the schema.

### Overrides

Environment variables, all with sensible defaults:
`SSH_TARGET` (default `dchpadm@dchp.arts.ubc.ca`), `PROD_SCHEMA`,
`LOCAL_SCHEMA`, `LOCAL_CHARSET`, `BACKUP_DIR`, `PROD_READ_USER`.

### Recovering the previous local database

```
gzip -dc ~/dchp3-local-db-backups/dchp3-before-refresh-<stamp>.sql.gz \
  | mysql -u root -h 127.0.0.1 dchp3
```
