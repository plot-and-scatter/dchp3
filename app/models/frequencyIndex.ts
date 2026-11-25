// Pure helpers for the Frequency Index tool. No server imports: the form
// runs these in the browser to build Google links and compute the index as
// counts are typed, and the action runs the same code when saving.
//
// Method: DCHP-2's Frequency Index, hits(term, domain) / hits(normalizer,
// domain) x multiplier, per national domain, compared across domains. See
// docs/frequency-index/frequency-index.md.

import { z } from "zod"

export type FrequencyDomain = {
  key: string
  label: string
  /**
   * Top-level domains searched. More than one means the country is counted
   * with one search per domain and the counts are added up: see
   * FREQUENCY_SEARCHES.
   */
  tlds: string[]
}

// The DCHP-2 domain set: one entry per country, which is one column in the
// chart. The US is a group because .us is barely used.
export const FREQUENCY_DOMAINS: FrequencyDomain[] = [
  { key: "ca", label: "Canada", tlds: [".ca"] },
  { key: "us", label: "USA", tlds: [".edu", ".gov", ".mil", ".us"] },
  { key: "uk", label: "UK", tlds: [".uk"] },
  { key: "ie", label: "Ireland", tlds: [".ie"] },
  { key: "nz", label: "New Zealand", tlds: [".nz"] },
  { key: "au", label: "Australia", tlds: [".au"] },
  { key: "za", label: "South Africa", tlds: [".za"] },
]

export const FREQUENCY_DOMAIN_KEYS = FREQUENCY_DOMAINS.map((d) => d.key) as [
  string,
  ...string[]
]

/**
 * One Google search: a single top-level domain. A country with one domain
 * has one search, under the country's own key ("ca"). A country with several
 * has one search per domain ("us.edu", "us.gov", ...), and its count is the
 * searches added up, for the term and for the normalizer alike.
 *
 * Until 2026-11 the US was one search, `site:.edu OR site:.gov OR site:.mil
 * OR site:.us`. Google's estimate for that search is right for a rare term
 * and far too low for a normalizer such as "the": on 2026-11-24 it gave 1.75
 * billion where the four domains searched separately gave 5.92 billion, and
 * less than .gov alone. The term was counted in full and the normalizer was
 * not, so the US index came out about 3.4 times too high. See
 * docs/frequency-index/frequency-index.md, "US: four searches added up".
 */
export type FrequencySearch = FrequencyDomain & {
  /** The country this search counts toward: a key of FREQUENCY_DOMAINS. */
  domainKey: string
}

export const FREQUENCY_SEARCHES: FrequencySearch[] = FREQUENCY_DOMAINS.flatMap(
  (d) =>
    d.tlds.length === 1
      ? [{ ...d, domainKey: d.key }]
      : d.tlds.map((tld) => ({
          key: `${d.key}${tld}`,
          label: `${d.label} ${tld}`,
          tlds: [tld],
          domainKey: d.key,
        }))
)

export const FREQUENCY_SEARCH_KEYS = FREQUENCY_SEARCHES.map((s) => s.key) as [
  string,
  ...string[]
]

export const searchByKey = (key: string) =>
  FREQUENCY_SEARCHES.find((s) => s.key === key)

export const searchesOf = (domainKey: string) =>
  FREQUENCY_SEARCHES.filter((s) => s.domainKey === domainKey)

/**
 * Countries that were once counted with one combined OR search. Rows and
 * normalizer counts saved that way keep the country's key ("us") and are
 * shown, marked as superseded; nothing new is saved under these keys.
 */
export const COMBINED_SEARCHES: FrequencyDomain[] = FREQUENCY_DOMAINS.filter(
  (d) => d.tlds.length > 1
)

export const isCombinedSearchKey = (key: string) =>
  COMBINED_SEARCHES.some((d) => d.key === key)

/** Label for the counts of an old combined search, wherever they are listed. */
export const combinedSearchLabel = (domain: FrequencyDomain) =>
  `${domain.label}, one combined search (no longer used)`

/**
 * The series to show for a normalizer's history: every search, then any old
 * combined search that has counts in the history given.
 */
export const historySeries = (
  history: Record<string, unknown[]>
): { key: string; label: string }[] => [
  ...FREQUENCY_SEARCHES,
  ...COMBINED_SEARCHES.filter((d) => (history[d.key] ?? []).length > 0).map(
    (d) => ({ key: d.key, label: combinedSearchLabel(d) })
  ),
]

/** The country a stored row or count belongs to, whichever way it was read. */
export const countryKeyOf = (key: string) => searchByKey(key)?.domainKey ?? key

/** Add up the counts of a country's searches; null until every one is known. */
export const addCounts = (counts: (number | null)[]): number | null =>
  counts.length === 0 || counts.some((c) => c === null)
    ? null
    : (counts as number[]).reduce((sum, c) => sum + c, 0)

export const DEFAULT_NORMALIZER = "the"
// 10 million and 100 million added 2026-10-02 for Stefan, for very rare terms.
export const MULTIPLIERS = [
  10_000, 100_000, 1_000_000, 10_000_000, 100_000_000,
] as const
export const DEFAULT_MULTIPLIER: typeof MULTIPLIERS[number] = 10_000

/** Language pinned on every generated link so all students run the same query. */
export const GOOGLE_HL = "en"
export const BACKEND_BROWSER = "browser"

export const siteClause = (domain: FrequencyDomain) =>
  domain.tlds.map((tld) => `site:${tld}`).join(" OR ")

/** Quote a multi-word term so Google searches the phrase. */
const quoteIfPhrase = (term: string) =>
  /\s/.test(term) && !/^".*"$/.test(term) ? `"${term}"` : term

const quoted = (piece: string) => (/^".*"$/.test(piece) ? piece : `"${piece}"`)

const splitOn = (text: string, operator: "AND" | "OR") =>
  text
    .split(new RegExp(`\\s+${operator}\\s+`))
    .map((p) => p.trim())
    .filter(Boolean)

/**
 * `toque AND hockey` means pages that contain both words. Google has no AND
 * operator (every term is required by default, but a bare word may be
 * dropped or matched loosely), so each side is quoted: `"toque" "hockey"`.
 * AND must be upper case with a space on each side; "and" in a phrase is
 * left alone. A side that is already a phrase is quoted once.
 *
 * `EU OR European Union` means pages that contain either. OR is read before
 * AND, as Google reads it, so `associate member AND EU OR European Union`
 * is "associate member" with either of the other two:
 * `"associate member" ("EU" OR "European Union")`. The alternatives are put
 * in brackets so the grouping is visible in the query that is stored and
 * shown. Added for Natalia, 2026-11-24.
 *
 * A term typed entirely inside one pair of quotes is a phrase and is not
 * split, so `"sink OR swim"` searches for those three words together.
 */
export const searchTerms = (term: string) => {
  const trimmed = term.trim()
  if (/^"[^"]*"$/.test(trimmed)) return trimmed

  const groups = splitOn(trimmed, "AND")
    .map((group) => splitOn(group, "OR"))
    .filter((alternatives) => alternatives.length > 0)
  if (groups.length === 0 || (groups.length === 1 && groups[0].length === 1))
    return quoteIfPhrase(trimmed)

  return groups
    .map((alternatives) =>
      alternatives.length === 1
        ? quoted(alternatives[0])
        : `(${alternatives.map(quoted).join(" OR ")})`
    )
    .join(" ")
}

/**
 * The query for the term on one domain. Exclusions (`-word`, `-site:x`) go
 * here and only here: they narrow the numerator, never the normalizer,
 * because the normalizer count stands in for the size of the domain.
 */
export const termQuery = (
  term: string,
  domain: FrequencyDomain,
  exclusions?: string | null
) => {
  const ex = normalizeExclusions(exclusions)
  return [searchTerms(term), ex, siteClause(domain)].filter(Boolean).join(" ")
}

export const normalizerQuery = (normalizer: string, domain: FrequencyDomain) =>
  `${searchTerms(normalizer)} ${siteClause(domain)}`

/**
 * Exclusions are typed as free text. A bare word excludes pages containing
 * that word; a quoted phrase excludes pages containing the phrase, which is
 * what you want for a multi-word exclusion. Each piece gets one `-`, so
 * "monkey site:foo.com" and `-monkey -site:foo.com` mean the same thing, and
 * `"skate bag"` becomes `-"skate bag"`, not two broken halves. Commas between
 * pieces are ignored. Decided after Stefan's "bag skate" lookup, 2026-10-02:
 * excluding the bare word "skate" from that search removes every hit.
 */
export const exclusionTokens = (exclusions?: string | null) =>
  Array.from((exclusions ?? "").matchAll(/-?"[^"]*"|[^\s,]+/g), (m) => m[0])
    .map((token) => token.replace(/^-/, ""))
    .filter((token) => token !== "" && token !== '""')

export const normalizeExclusions = (exclusions?: string | null) =>
  exclusionTokens(exclusions)
    .map((token) => `-${token}`)
    .join(" ")

export const googleSearchUrl = (query: string) => {
  const url = new URL("https://www.google.com/search")
  url.searchParams.set("q", query)
  url.searchParams.set("hl", GOOGLE_HL)
  return url.toString()
}

/**
 * Keep only the first number of whatever was typed or pasted, so "About
 * 1,230,000 results (0.42 seconds)" becomes "1230000" and the timing is
 * not glued on. Commas, periods and spaces inside the number are treated as
 * thousands separators. Returns "" when there is no digit.
 */
export const digitsOnly = (raw: string) => {
  const match = raw.match(/\d[\d,.\s]*\d|\d/)
  return match ? match[0].replace(/\D+/g, "") : ""
}

/** Parse a count string; null when empty or not a number. */
export const parseCount = (raw: string): number | null => {
  const digits = digitsOnly(raw)
  if (digits === "") return null
  const n = Number(digits)
  return Number.isSafeInteger(n) ? n : null
}

/** hits(term) / hits(normalizer) x multiplier; null when it cannot be computed. */
export const frequencyIndex = (
  termHits: number | null,
  normalizerHits: number | null,
  multiplier: number
): number | null => {
  if (termHits === null || normalizerHits === null || normalizerHits <= 0)
    return null
  return (termHits / normalizerHits) * multiplier
}

export const formatIndex = (index: number | null) =>
  index === null ? "" : index.toFixed(2)

export const formatCount = (n: number | null | undefined) =>
  n === null || n === undefined ? "" : n.toLocaleString("en-CA")

/** 4,380,000,000 as "4.4B", 247,000,000 as "247M": for labels, not records. */
export const formatCompact = (n: number) =>
  new Intl.NumberFormat("en-CA", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n)

// ---------------------------------------------------------------- form schema

const countField = z
  .number({ invalid_type_error: "Enter a number" })
  .int()
  .min(0)
  .max(Number.MAX_SAFE_INTEGER)

const multiplierField = z
  .number()
  .refine((m) => (MULTIPLIERS as readonly number[]).includes(m), {
    message: `Multiplier must be one of ${MULTIPLIERS.map((m) =>
      formatCount(m)
    ).join(", ")}`,
  })

const uniqueRows = <T extends z.ZodType<{ domainKey: string }>>(
  rows: z.ZodArray<T>
) =>
  rows.refine(
    (list) => new Set(list.map((r) => r.domainKey)).size === list.length,
    { message: "Each search must appear exactly once" }
  )

export const FrequencyLookupSchema = z.object({
  term: z
    .string({ required_error: "Enter a term" })
    .trim()
    .min(1, "Enter a term"),
  normalizer: z
    .string({ required_error: "Enter a normalizer" })
    .trim()
    .min(1, "Enter a normalizer"),
  exclusions: z.string().trim().optional(),
  multiplier: multiplierField,
  // One row per search, not per country: the US is four rows. `domainKey`
  // holds the search's key; the name is kept from when the two were the same.
  rows: uniqueRows(
    z
      .array(
        z.object({
          domainKey: z.enum(FREQUENCY_SEARCH_KEYS),
          termHits: countField,
          normalizerHits: countField.min(1, "Normalizer count must be above 0"),
          /** Set when the normalizer count was reused from an existing observation. */
          normalizerCountId: z.number().int().optional(),
        })
      )
      .length(FREQUENCY_SEARCHES.length, "One row per search is required")
  ),
})

export type FrequencyLookupInput = z.infer<typeof FrequencyLookupSchema>

/**
 * Correcting a saved lookup: the counts and the multiplier can change, the
 * term, normalizer and exclusions cannot, because the stored queries and
 * links were built from them. A wrong term is a new lookup.
 *
 * A changed normalizer count is either a correction of the observation,
 * which changes every lookup that used it, or a new observation for this
 * lookup alone. `normalizerChange` says which; it is only read when the
 * count differs from the stored one.
 */
export const NORMALIZER_CHANGES = ["correct", "new"] as const
export type NormalizerChange = typeof NORMALIZER_CHANGES[number]

export const FrequencyLookupEditSchema = z.object({
  multiplier: multiplierField,
  // The rows are whatever the saved lookup has: one per search for a lookup
  // saved now, one per country for a lookup saved when the US was a single
  // combined search. The save checks that every stored row is present.
  rows: uniqueRows(
    z
      .array(
        z.object({
          domainKey: z.string().min(1),
          termHits: countField,
          normalizerHits: countField.min(1, "Normalizer count must be above 0"),
          normalizerChange: z.enum(NORMALIZER_CHANGES).default("correct"),
        })
      )
      .min(1, "No counts were sent")
  ),
})

export type FrequencyLookupEditInput = z.infer<typeof FrequencyLookupEditSchema>

export const domainByKey = (key: string) =>
  FREQUENCY_DOMAINS.find((d) => d.key === key)

/** Source label for a normalizer count read during a term lookup. */
export const SOURCE_LOOKUP = "lookup"
