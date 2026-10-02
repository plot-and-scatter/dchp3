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
  /** Top-level domains searched. More than one means a `site: OR site:` group. */
  tlds: string[]
}

// The DCHP-2 domain set. The US is a group because .us is barely used.
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

/**
 * `toque AND hockey` means pages that contain both words. Google has no AND
 * operator (every term is required by default, but a bare word may be
 * dropped or matched loosely), so each side is quoted: `"toque" "hockey"`.
 * AND must be upper case with a space on each side; "and" in a phrase is
 * left alone. A side that is already a phrase is quoted once.
 */
export const searchTerms = (term: string) => {
  const parts = term
    .trim()
    .split(/\s+AND\s+/)
    .map((p) => p.trim())
    .filter(Boolean)
  if (parts.length <= 1) return quoteIfPhrase(term.trim())
  return parts.map((p) => (/^".*"$/.test(p) ? p : `"${p}"`)).join(" ")
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
 * Exclusions are typed as free text. Each whitespace-separated token that
 * does not already start with `-` gets one, so "monkey site:foo.com" and
 * "-monkey -site:foo.com" mean the same thing.
 */
export const normalizeExclusions = (exclusions?: string | null) =>
  (exclusions ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => (token.startsWith("-") ? token : `-${token}`))
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

const rowsField = <T extends z.ZodType<{ domainKey: string }>>(row: T) =>
  z
    .array(row)
    .length(FREQUENCY_DOMAINS.length, "One row per domain is required")
    .refine(
      (rows) =>
        new Set(rows.map((r) => r.domainKey)).size === FREQUENCY_DOMAINS.length,
      { message: "Each domain must appear exactly once" }
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
  rows: rowsField(
    z.object({
      domainKey: z.enum(FREQUENCY_DOMAIN_KEYS),
      termHits: countField,
      normalizerHits: countField.min(1, "Normalizer count must be above 0"),
      /** Set when the normalizer count was reused from an existing observation. */
      normalizerCountId: z.number().int().optional(),
    })
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
  rows: rowsField(
    z.object({
      domainKey: z.enum(FREQUENCY_DOMAIN_KEYS),
      termHits: countField,
      normalizerHits: countField.min(1, "Normalizer count must be above 0"),
      normalizerChange: z.enum(NORMALIZER_CHANGES).default("correct"),
    })
  ),
})

export type FrequencyLookupEditInput = z.infer<typeof FrequencyLookupEditSchema>

export const domainByKey = (key: string) =>
  FREQUENCY_DOMAINS.find((d) => d.key === key)

/** Source label for a normalizer count read during a term lookup. */
export const SOURCE_LOOKUP = "lookup"
