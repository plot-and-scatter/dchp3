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
`frontmatter`, `abbreviations`, `copyright-notice`).

The DCHP-1 texts were ported unchanged from the 2013 CakePHP templates
(`app/views/pages/*.thtml`, `elements/welcome.thtml`) with the old site's
screenshots.

DCHP-2 has no pages yet; its config has an empty page set so a DCHP-2
deployment 404s on front matter rather than showing DCHP-1's.

## Lifting an archive database

Load the dump, create the Frequency Index tables (the Prisma client expects
them even though the archive never reaches those routes), then run the lift:

```sh
mysql dchpca_dchp1 < sql/create-frequency-index.sql
mysql dchpca_dchp1 -e "SET @edition='dchp1'; SOURCE sql/archive-edition-lift.sql"
```

The lift stamps `det_entries.dchp_version` with the edition (the old apps
never set it; the search and the entry page read it) and re-creates the four
views (`det_bibliographies`, `det_citations`, `det_shortcitations`,
`det_users`) so their definer is the current user. The dumps name the old
hosting account as definer, which no longer exists, and MySQL then refuses
every SELECT on them with error 1449.

## Running an archive locally

```sh
DCHP_EDITION=dchp1 DATABASE_URL="mysql://root@127.0.0.1:3306/dchpca_dchp1" PORT=3001 npm run dev
```

## Adding an edition-specific behaviour

Ask first whether it is really edition-specific. Editing features are already
hidden by the user check; display improvements should apply to all editions.
If it is, put the switch in the edition config (`app/editions/index.tsx`) and
read it through `useEdition()` in components or `getEditionId()` on the
server, rather than scattering `process.env.DCHP_EDITION` reads.
