# Frequency Index tool

Decided 2026-09-22 with Frank; method confirmed with Stefan Dollinger. Built for
[Frequency Index tool: manual Google hit-count entry with keyboard-first workflow](https://github.com/plot-and-scatter/dchp3/issues/482).

## The decision

DCHP-2 labels Type 5 (Frequency) Canadianisms with a Frequency Index computed
from Google hit counts. Students had been doing this by hand in their own
browsers over several days, with no tooling and no record of the raw counts.
The tool keeps that method, because there is no alternative source of the
numbers, and adds a form, a keyboard workflow, and a database record.

**No API supplies the counts.** Google's Custom Search JSON API could search the
whole web only through a Programmable Search Engine set to "Search the entire
web". That option closed to new engines on 2026-01-20 and the API shuts down on
2027-01-01. Vertex AI Search, the suggested replacement, searches only a list of
named domains. Google also sends `x-frame-options: SAMEORIGIN` on its results
page, so it cannot be embedded. Third-party SERP resellers load google.com and
return the count as JSON; they are paid, unsanctioned by Google, and not used.
[Ask Stefan to fill in the Google Web Search Products Interest Form](https://github.com/plot-and-scatter/dchp3/issues/481)
is the one route Google offers to future access.

## The method

For each national domain, Frequency Index = hits(term, domain) ÷
hits(normalizer, domain) × multiplier. The indices are then compared across
domains; there is no threshold, and Type 5 remains an editorial judgment.

- **Domains** (DCHP-2 set): Canada `.ca`; USA `.edu` OR `.gov` OR `.mil` OR
  `.us`; UK `.uk`; Ireland `.ie`; New Zealand `.nz`; Australia `.au`; South
  Africa `.za`. Defined once in `FREQUENCY_DOMAINS` in `app/models/frequencyIndex.ts`.
- **Normalizer**: `the` by default, per Stefan's current practice. Dollinger
  (2016, "Googleology as Smart Lexicography", *Dictionaries* 37: 60–98) used
  `could`. The field is editable, and the normalizer is stored on every lookup
  so indices made with different normalizers are never confused.
- **Multiplier**: 10,000 or 100,000, for readability only.
- **Exclusions**: free text, each token becomes `-token` (so `site:x.com`
  becomes `-site:x.com`). Applied to the term query on every domain identically
  and never to the normalizer query, whose count stands in for the size of the
  domain. Stored on the lookup.
- **Links**: every count links to the exact google.com query with `hl=en`
  pinned. The page tells students to use a private window, because google.com
  personalizes results and no link can prevent that.

## What it does, and where each thing is written

- **Permission** `det:frequencyIndex`, granted to Student / Editor and above,
  in `app/services/auth/AuthRole.ts`. Guards both the loader and the action of
  `app/routes/frequency-index/index.tsx` and the loader of
  `app/routes/frequency-index/$id.tsx`; checked by
  `app/routes/permission-guards.test.ts`.
- **Form** `app/components/frequencyIndex/FrequencyIndexForm.tsx`. The table is
  built in the browser from the term; nothing is fetched until save. Count
  fields keep only the first number of whatever is typed or pasted. Enter in an
  empty count field opens its search in a tab; Enter in a filled one moves on;
  Cmd/Ctrl+Enter saves. "Open all" uses `window.open` with a named target per
  domain, and a blocked popup shows a note on allowing them.
- **Normalizer reuse**: counts saved in the last 7 days for the same normalizer
  and domain are prefilled and marked, with the source row id stored in
  `normalizer_reused_from_id`. Editing the value clears the reference.
- **Tables** `det_frequency_lookups` (one per term and sitting: term,
  normalizer, exclusions, multiplier, backend, hl, gl, user, created) and
  `det_frequency_lookup_rows` (one per domain: queries, both counts as BIGINT,
  index as DOUBLE). Models `FrequencyLookup` and `FrequencyLookupRow` in
  `prisma/schema.prisma`; DDL in `sql/create-frequency-index.sql`, applied by
  hand because the project has no migration workflow.
- **History**: the page lists recent lookups; each has a view page with the
  rows, links to the queries, and a "Repeat this lookup" link that prefills the
  form through the query string.

## What is deliberately absent

- Charts across domains, and comparison against DCHP-2's published indices.
- Any automated backend. The `backend` column exists so one can be added
  later (`browser` today) without changing the rows' meaning.
- A browser extension that reads the count off the results page and posts it
  back. Considered and deferred until typing proves to be the bottleneck.
- Tab groups or a dedicated window for the seven searches: not possible from
  a web page.
