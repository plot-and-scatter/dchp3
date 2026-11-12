# Editions: one codebase, three dictionaries

The dchp3 codebase serves DCHP-3 and, as read-only archives, DCHP-1 and
DCHP-2. Each deployment is the same build with two environment variables set
differently:

| | `DCHP_EDITION` | `DATABASE_URL` points at |
| --- | --- | --- |
| DCHP-3 (live, editable) | unset or `dchp3` | the DCHP-3 database |
| DCHP-1 archive | `dchp1` | a lifted copy of the DCHP-1 database |
| DCHP-2 archive | `dchp2` | a lifted copy of the DCHP-2 database |

Why this shape: the old DCHP-1 and DCHP-2 sites ran on a PHP stack that can
no longer be patched (issue #499). Their databases already have the same
`det_*` tables dchp3 reads, so the cheapest safe way to keep them public is to
put the DCHP-3 front end over each frozen database and switch off everything
that writes.

## What an archive switches off

All of it hangs off `app/editions/edition.ts` and `edition.server.ts`:

- **Nobody is ever signed in.** `getUserFromSession` returns nothing in an
  archive, and every permission check in `app/services/auth/session.server.ts`
  goes through it, so all editing UI and all guarded loaders stay closed.
- **The editing, Bank and sign-in routes 404.** The root loader checks the
  pathname against `ARCHIVE_BLOCKED_PATH_PREFIXES` on every request.
- **The nav has no account menu**, and the header bar is coloured per edition (green for DCHP-1, blue for DCHP-2).
- **The search form hides filters that make no sense** for the edition: the
  database checkboxes when there is only one database, and the Canadianism
  type boxes for DCHP-1, whose meanings carry no type (the queries skip the
  category filter in that case; see `app/models/search/entryCategory.ts`).

Everything a signed-out visitor can read on DCHP-3 works the same in an
archive: home, about, how-to-use, browse, search, entry pages, references.

## Front matter per edition

The pages that differ by edition live under `app/editions/<edition>/pages/`
as plain components, registered in `app/editions/index.tsx` together with the
edition's titles and nav links. The shared routes (`/`, `/about`,
`/how-to-use`, `/acknowledgements`) are thin: they look the page up by slug
for the edition being served, and 404 when the edition has no such page.
Pages an edition has beyond those are served at `/pages/<slug>` (DCHP-1:
`frontmatter`, `abbreviations`, `copyright-notice`; DCHP-2: `foreword`).

The DCHP-1 texts were ported unchanged from the 2013 CakePHP templates
(`app/views/pages/*.thtml`, `elements/welcome.thtml`) with the old site's
screenshots.

The DCHP-2 texts come from the 2017 site (`dchp2-old/dchp2/app/views/pages`,
the published DCHP-2, database `dchpca_dchp_2`; the uppercase `DCHP-2`
folder is an older editing install with placeholder pages). They were
Word-exported HTML, run through `tidy` and then the same conversion.

## Lifting an archive database

Load the dump, run the lift, then create the Frequency Index tables (the
Prisma client expects them even though the archive never reaches those
routes):

```sh
(echo "SET @edition='dchp1';"; cat sql/archive-edition-lift.sql) | mysql dchpca_dchp1
mysql dchpca_dchp1 < sql/create-frequency-index.sql
```

The lift adds the few columns dchp3 gained after the archives were frozen
(`det_entries.dchp_version`, `det_log_entries.action` and `.email`), converts
`user` to InnoDB so the frequency tables' foreign key can reference it, stamps
`dchp_version` (the old apps never set it; the search and the entry page read
it: every DCHP-1 entry is `dchp1`, and in DCHP-2 the entries flagged
`is_legacy`, inherited from DCHP-1, are `dchp1` and the rest `dchp2`, as in
DCHP-3's own import) and re-creates the four views (`det_bibliographies`, `det_citations`, `det_shortcitations`,
`det_users`) so their definer is the current user. The dumps name the old
hosting account as definer, which no longer exists, and MySQL then refuses
every SELECT on them with error 1449.

### Entry images

Entry images are not in the database; `det_images.path` is a key into the
image bucket, and the app prefixes it with `IMAGE_BUCKET_PREFIX`. Both
archives use the same bucket as DCHP-3, so an archive deployment needs
`IMAGE_BUCKET_PREFIX` set (the other `IMAGE_BUCKET_*` variables are for
uploads, which an archive never does).

- DCHP-2's 1,266 entry images are in its own `det_images` and all exist in
  the bucket.
- DCHP-1's drawings were recorded by the 2013 site only as
  `det_entries.image_file_name`, which the dchp3 code does not read, and the
  files are not in any copy of the old site on hand. DCHP-3 holds the same
  scans in its `det_images`, so `sql/dchp1-archive-images.sql` copies those
  rows into the DCHP-1 archive by headword (run it after the lift). Three
  drawings (bombardier, kayak ((1)), tuque) have no scan anywhere we know of.

## Running an archive locally

```sh
DCHP_EDITION=dchp1 DATABASE_URL="mysql://root@127.0.0.1:3306/dchpca_dchp1" PORT=3001 npm run dev
DCHP_EDITION=dchp2 DATABASE_URL="mysql://root@127.0.0.1:3306/dchp2" PORT=3002 npm run dev
```

## Adding an edition-specific behaviour

Ask first whether it is really edition-specific. Editing features are already
hidden by the user check; display improvements should apply to all editions.
If it is, put the switch in the edition config (`app/editions/index.tsx`) and
read it through `useEdition()` in components or `getEditionId()` on the
server, rather than scattering `process.env.DCHP_EDITION` reads.

## Deploying the archives

Both archives run on the production server beside DCHP-3, at
`https://dchp.arts.ubc.ca/dchp1/` and `/dchp2/`. Each is a separate process
serving its own tree and build, because the path prefix (`DCHP_BASENAME`) is
baked into the build by Vite and React Router. The scripts follow the
production split: `deploy.sh <edition>` installs and builds by hand,
`start-archive.sh <edition>` only serves, from the template unit
`dchp3-archive@.service`. See `scripts/server/README.md` for the production
versions of the same steps.

| | DCHP-1 | DCHP-2 |
| --- | --- | --- |
| tree | `/var/www/dchp3-dchp1` | `/var/www/dchp3-dchp2` |
| env file | `.env.dchp1` in the tree | `.env.dchp2` in the tree |
| database | `dchpca_dchp1` | `dchpca_dchp2` |
| port | 3011 | 3012 |
| unit | `dchp3-archive@dchp1` | `dchp3-archive@dchp2` |
| URL | `/dchp1/` | `/dchp2/` |

### One-time setup, per edition

1. **Database.** Load the dump into a new database, run the lift with that
   edition, then the frequency index, and grant the app's MySQL user SELECT
   on it (the archive never writes, apart from the lift itself):

   ```
   mysql -e "CREATE DATABASE dchpca_dchp1 CHARACTER SET utf8mb4"
   mysql dchpca_dchp1 < dchp1-dump.sql
   (echo "SET @edition='dchp1';"; cat sql/archive-edition-lift.sql) | mysql dchpca_dchp1
   mysql dchpca_dchp1 < sql/create-frequency-index.sql
   mysql dchpca_dchp1 < sql/dchp1-archive-images.sql     # DCHP-1 only
   ```

2. **Tree and env file.**

   ```
   sudo git clone https://github.com/plot-and-scatter/dchp3 /var/www/dchp3-dchp1
   ```

   Then `/var/www/dchp3-dchp1/.env.dchp1`, which is untracked like
   `.env.production`:

   ```
   DCHP_EDITION=dchp1
   DCHP_BASENAME=/dchp1
   PORT=3011
   DATABASE_URL="mysql://<user>:<password>@localhost:3306/dchpca_dchp1"
   IMAGE_BUCKET_PREFIX="<same value as production>"
   COOKIE_SECRET="<any random string>"
   SESSION_SECRET="<any random string>"
   SITE_URL="https://dchp.arts.ubc.ca/dchp1"
   ```

   The two secrets are never used to set a cookie in an archive, but the
   session module reads them at start-up. The Auth0 and image-bucket write
   credentials are left out: nothing in an archive signs in or uploads.

3. **Scripts and unit**, installed root-only beside the production ones:

   ```
   sudo cp scripts/server/start-archive.sh /usr/local/sbin/dchp3-start-archive.sh
   sudo chown root:root /usr/local/sbin/dchp3-start-archive.sh
   sudo chmod 700 /usr/local/sbin/dchp3-start-archive.sh
   sudo cp scripts/server/dchp3-archive@.service /etc/systemd/system/
   sudo systemctl daemon-reload
   sudo systemctl enable dchp3-archive@dchp1
   ```

   The deploy script is the shared one already installed for production;
   update it from this branch, since it gained the two edition cases.

4. **First deploy**, which also starts the unit:

   ```
   sudo /usr/local/sbin/dchp3-deploy.sh dchp1
   ```

5. **Proxy.** Whatever fronts port 3000 for DCHP-3 needs a location per
   archive that passes the prefix through unchanged (the app expects it).
   The app itself answers `/dchp1` with a redirect to `/dchp1/`.

   nginx:

   ```
   location /dchp1/ { proxy_pass http://127.0.0.1:3011; proxy_set_header Host $host; }
   location = /dchp1 { return 301 /dchp1/; }
   ```

   Apache:

   ```
   ProxyPass        /dchp1/ http://127.0.0.1:3011/dchp1/
   ProxyPassReverse /dchp1/ http://127.0.0.1:3011/dchp1/
   RedirectMatch 301 ^/dchp1$ /dchp1/
   ```

### Later deploys

`sudo /usr/local/sbin/dchp3-deploy.sh dchp1` (or `dchp2`). The archives
deploy main only, like production, so a change reaches them by being merged.
