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

- **Domains** (DCHP-2 set): Canada `.ca`; USA `.edu`, `.gov`, `.mil` and
  `.us`; UK `.uk`; Ireland `.ie`; New Zealand `.nz`; Australia `.au`; South
  Africa `.za`. Defined once in `FREQUENCY_DOMAINS` in
  `app/models/frequencyIndex.ts`: one entry per country, which is one column
  of the chart.
- **US: four searches added up** (2026-11-25, GitHub issue 500). Each
  top-level domain is its own Google search (`FREQUENCY_SEARCHES`, ten in
  all: keys `ca`, `us.edu`, `us.gov`, `us.mil`, `us.us`, `uk`, ...). A lookup
  stores one row and uses one normalizer observation per search. The US
  index is (the four term counts added) / (the four normalizer counts added)
  x multiplier, computed on read like every index (`groupByCountry` in
  `app/models/frequencyIndex.server.ts`; the form and the correction page
  do the same sum with `addCounts`). This is how Natalia's spreadsheet
  counted the US before the tool existed.

  Why: from 2026-09-29 the tool sent one search,
  `site:.edu OR site:.gov OR site:.mil OR site:.us`. Natalia and the students
  saw the US normalizer drop from about 6.6 billion to about 1.7 billion on
  that date. Counts read by Frank from google.com on 2026-11-24:

  | Search | "the" | "toque" |
  | --- | --- | --- |
  | `.edu` | 1,180,000,000 | 181,000 |
  | `.gov` | 4,120,000,000 | 14,400 |
  | `.mil` | 84,700,000 | 252 |
  | `.us` | 537,000,000 | 105,000 |
  | the four added up | 5,921,700,000 | 300,652 |
  | one OR search | 1,750,000,000 | 300,000 |

  Google's figure for the OR search is right for a rare term and about a
  third of the real figure for the normalizer (less than `.gov` alone), so
  the US index came out about 3.4 times too high (about 4 times in late
  September). Google does not document how it estimates counts; the working
  explanation is that a small result set is close to a real count and a very
  large one is extrapolated, badly when the query has several `site:`
  conditions joined by OR. One term on one day: the factor is approximate.
  The size at which the OR figure starts to fail is unknown, which is why
  the term is searched per domain too and not only the normalizer.

  **Lookups saved before the change** keep their single US row and
  observation under the key `us` (`COMBINED_SEARCHES`). They cannot be
  corrected, because the four counts were not read on those dates. Their
  page and their correction page say the US index is too high and link to
  "Repeat this lookup"; `FrequencyLookupView.hasCombinedSearch` and the
  country's `method: "combined"` carry this. Nothing new is saved under
  `us`, and the form's schema rejects it. On the normalizer history page
  the old series has its own panel and column, "USA, one combined search
  (no longer used)", with a note: its spreadsheet readings (to 2026-09-22)
  are the four added up, its tool readings are the OR search. No database
  change was needed: `domain_key` holds the search key.

  `scripts/local/import-normalizer-counts.mjs` now also imports the
  spreadsheet's `.edu`, `.gov`, `.mil` and `.us` columns as `us.edu` etc.,
  so the four US series start in July 2026. Run it again on each database
  after deploying; it skips rows already present.
- **Normalizer**: `the` by default, per Stefan's current practice. Dollinger
  (2016, "Googleology as Smart Lexicography", *Dictionaries* 37: 60–98) used
  `could`. The field is editable, and the normalizer is stored on every lookup
  so indices made with different normalizers are never confused.
- **Multiplier**: 10,000, 100,000, 1,000,000, 10,000,000 or 100,000,000,
  for readability only. The million was added on 2026-09-24 at Frank's
  request for rare terms; ten and a hundred million on 2026-10-02 for
  Stefan.
- **Exclusions**: whitespace-separated pieces, each given one `-`; a quoted
  phrase stays together (`"skate bag"` becomes `-"skate bag"`); commas are
  ignored. This is the opposite default from the term field, where a
  multi-word term is a phrase and `AND` separates words; Frank considered
  switching the term field to plain Google syntax and decided to keep it as
  is (2026-10-02), so the help text names the difference instead. Added
  2026-10-02 after Stefan's "bag skate" lookup, where the
  unquoted form would have excluded the word "skate" and so every hit. A
  saved lookup's exclusions cannot be edited, because each stored count was
  read from the stored query; "Try different exclusions" on the lookup page
  (and a sentence on the correction page) opens the form prefilled with the
  exclusions field focused (`?focus=exclusions`), so a refinement is a new
  lookup and the old one stays for comparison. No lineage is recorded
  (Frank, 2026-10-02).
- **AND**: `toque AND hockey` (upper-case AND, spaces on both sides) becomes
  `"toque" "hockey"`, which requires both words on the page. Google drops or
  loosens unquoted words, so each side is quoted. Handled by `searchTerms` in
  `app/models/frequencyIndex.ts`, for the normalizer too. Added 2026-09-24.
- **OR**: `EU OR European Union` (upper-case OR, spaces on both sides)
  becomes `("EU" OR "European Union")`, which counts pages with either. OR
  is read before AND, as Google reads it, so
  `associate member AND EU OR European Union` becomes
  `"associate member" ("EU" OR "European Union")`. A term typed entirely
  inside one pair of quotes is not split. Same function, `searchTerms`.
  Google's count for an OR query is not the sum of the separate counts (the
  US domain group has the same property). Added 2026-11-24 for Natalia.
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
- **Help** `app/components/frequencyIndex/HelpPanel.tsx`: field meanings,
  the keyboard workflow and the CAPTCHA and draft notes, in one panel behind
  a Help button beside the title. Closed by default so the form is
  uncluttered for people who know it (Frank, 2026-09-25); the choice is
  remembered in the browser.
- **Form** `app/components/frequencyIndex/FrequencyIndexForm.tsx`. The table is
  built in the browser from the term; nothing is fetched until save. Count
  fields keep only the first number of whatever is typed or pasted. Enter in an
  empty count field opens its search in a tab; Enter in a filled one moves on;
  Cmd/Ctrl+Enter saves. "Open all" uses `window.open` with a named target per
  domain, and a blocked popup shows a note on allowing them.
- **Normalizer observations** (`det_frequency_normalizer_counts`, model
  `FrequencyNormalizerCount`; redesigned 2026-09-25 with Frank). A normalizer
  count is a reading in its own right: the word, the domain, the hits, the
  calendar date, a source (`lookup`, or `spreadsheet` for imports), the
  lookup it was read during if any, and who recorded and who last corrected
  it. It is stored once whether it was read during a term lookup, reused by a
  later lookup, or imported.
- **Lookup rows** (`det_frequency_lookup_rows`) hold the term query and the
  term hits and point at the observation they used. Nothing derived is
  stored: the index is computed when read, from the row's term hits, the
  observation's hits and the lookup's multiplier. So correcting an
  observation corrects every lookup that used it, and nothing can go stale.
  Each row on the lookup page says whether its count was read there, reused
  from a named lookup, or imported, and whether it was corrected since.
- **Normalizer reuse**: the newest observation in the last 7 days for the
  same normalizer and domain, from any source, is prefilled and marked; the
  form sends its id and the server reuses it only if the id, word, domain and
  value still agree, otherwise a fresh observation is created.
- **Corrections** (`app/routes/frequency-index/$id.edit.tsx`): the counts and
  multiplier of a saved lookup can be changed; the term, normalizer and
  exclusions cannot, because the stored queries were built from them. A
  changed normalizer count is either a *correction* of the observation, which
  changes every lookup that used it, or a *fresh reading*, a new observation
  for this lookup alone. The page asks which only when another lookup uses the
  observation, and names those lookups. `updated` and `updated_user_id` are
  set on whatever changed.
- **Deletion**: a lookup can be deleted from its page after a confirm; its
  rows go with it, and observations read during it go too unless another
  lookup reused them (the foreign key then sets their `lookup_id` to null).
  A standalone observation can be deleted from the history page only when no
  row points at it; the database enforces that with `ON DELETE RESTRICT`.
- **Tables** `det_frequency_lookups` (one per term and sitting: term,
  normalizer, exclusions, multiplier, backend, hl, gl, user, created,
  updated, updated_user_id), plus the two above. DDL in
  `sql/create-frequency-index.sql`, applied by hand because the project has
  no migration workflow.
- **History**: the page lists the 25 most recent lookups; each has a view
  page with the rows, links to the queries, and a "Repeat this lookup" link
  that prefills the form through the query string. Under that list a link
  opens **All lookups** (`app/routes/frequency-index/lookups.tsx`, added
  2026-11-24 after Natalia could not reach lookups older than the 25): every
  saved lookup, newest first, 50 to a page, with a box that filters by words
  in the term.
- **Normalizer history** (`app/routes/frequency-index/normalizers.tsx`, added
  2026-09-24): one panel per domain of every observation, over 30 days, 90
  days, a year or all time, with the same numbers as a table beneath. The
  form shows the same series as a row of sparklines under the fields for the
  normalizer as typed over the last 90 days, moving into each domain's row
  beside the normalizer count once the table is built; the saved-lookup page
  shows them the same way. All of these are one component,
  `NormalizerSeriesChart.tsx`, at two sizes, drawing from the pure
  calculations in `app/models/normalizerSeries.ts` (time range, min/mean/max,
  change since first, scaling, UTC date labels). Hovering a point shows a
  card with the exact count, date and origin; beneath each chart are the
  first and last points and min, mean and max over the range shown, in
  compact form (4.4B, 247M). The y-axis is padded around the observed range
  rather than starting at zero, since the drift is what matters. One panel
  per domain because `.ca` and `.ie` differ by orders of magnitude.
- **Chart** (`app/components/frequencyIndex/FrequencyIndexChart.tsx`, added
  2026-09-30 at Frank's suggestion, from the formatting guide Natalia Mohar
  shared): the lookup page draws the DCHP-2 frequency chart as SVG, one
  column per domain in the order of the published DCHP-2 charts (.ca, .uk,
  .ie, .nz, .au, .za, US; the form and table keep the tool's order), labelled
  by domain with "US" for the US group (Frank, 2026-09-30 and 10-01), the index on the y-axis labelled
  "Frequency index (x10,000)" with the lookup's multiplier, a data label with
  one decimal place on each column, no legend, Calibri, or Carlito when the browser
  cannot see Calibri (Office for Mac keeps it inside the Word app; a "not
  seeing it?" link on the page gives the copy command). Carlito, Calibri's
  open-licence metric twin, is served from `public/fonts` as subset WOFF
  files, declared in `app/styles/additional.css`, and inlined into the SVG
  as data URLs before rasterizing, since an SVG in an image cannot load
  external resources (Frank, 2026-10-01) at 18 pt bold for the title and
  12 pt for the axes, 9 x 14 cm. The title is the term followed by each exclusion as "NOT word" or "NOT site:x" ("toque NOT monkey"; Frank, 2026-10-01). "Download
  PNG" serializes the SVG, draws it on a canvas at 300 dpi (1654 x 1063 px)
  and stamps a pHYs chunk (`app/utils/pngDpi.ts`) so Word opens it at 9 x 14
  cm. The caption the guide wants ("Internet Domain Search, 30 September
  2026", month spelled out, from the lookup's date) is shown beside the
  button with a copy button; it is not drawn on the image, because it is
  typed into the entry's image upload. Layout and text are pure functions in
  `app/models/frequencyChart.ts` (axis steps of 1, 2, 2.5 or 5 with 8%
  headroom, title and label shrinking when they would not fit), tested.
  Not done: the guide's "(English sites only)" caption variant, since the
  tool has no language restriction, and provincial domains.
- **Navigation**: every subpage has a "Back to the Frequency Index" link
  under its title (`BackLink.tsx`; Natalia, 2026-09-30).
- **Import**: `scripts/local/import-normalizer-counts.mjs` loads a spreadsheet
  export as observations with source `spreadsheet` and no lookup. First used
  for Natalia Mohar's sheet of "the" counts, 19 July to 22 September 2026,
  three significant figures. The sheet's provincial `.bc.ca`-style block was
  not imported; the tool has no such domains.
- **Not kept**: the value an observation had before a correction. The lookup
  page shows the corrected index, with the correction date and person on the
  row. An observation history table can be added if anyone needs the old
  values.

## Other search engines (surveyed 2026-09-22)

None replaces Google for this purpose. Bing's Web Search API was retired in
August 2025. DuckDuckGo has no results API. Brave Search has an independent
index and an API but returns no total count, only a more-pages flag. Mojeek
(independent index, paid API) returns a `results` total with an exact/estimate
flag and a `site` parameter, and is the one option worth a trial as an
automated second opinion; its index is far smaller than Google's, so counts
for rare regionalisms would be small and noisy, and whether `site` accepts a
bare TLD is untested. Common Crawl would give reproducible instance counts
from a downloadable corpus, as a separate data project rather than an API.
Filed for later on 2026-09-24 as
[Examine other search APIs as a source of Frequency Index counts](https://github.com/plot-and-scatter/dchp3/issues/483).

## What is deliberately absent

- Charts of the term's index across domains, and comparison against DCHP-2's
  published indices. (The normalizer history chart is the one chart there is.)
- Any automated backend. The `backend` column exists so one can be added
  later (`browser` today) without changing the rows' meaning.
- A browser extension that reads the count off the results page and posts it
  back. Considered and deferred until typing proves to be the bottleneck.
- Tab groups or a dedicated window for the seven searches: not possible from
  a web page.
