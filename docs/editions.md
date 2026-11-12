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
- **The nav has no account menu**, and the header carries an ARCHIVE badge.
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
`dchp_version` with the edition (the old apps never set it; the search and the
entry page read it) and re-creates the four views (`det_bibliographies`, `det_citations`, `det_shortcitations`,
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
  rows into the DCHP-1 archive by headword (run it after the lift). Four
  drawings (bombardier, igloo, kayak ((1)), tuque) have no scan anywhere we
  know of.

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
