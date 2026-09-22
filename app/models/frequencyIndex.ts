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
export const MULTIPLIERS = [10_000, 100_000] as const
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
  return [quoteIfPhrase(term.trim()), ex, siteClause(domain)]
    .filter(Boolean)
    .join(" ")
}

export const normalizerQuery = (normalizer: string, domain: FrequencyDomain) =>
  `${quoteIfPhrase(normalizer.trim())} ${siteClause(domain)}`

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

// ---------------------------------------------------------------- form schema

const countField = z
  .number({ invalid_type_error: "Enter a number" })
  .int()
  .min(0)
  .max(Number.MAX_SAFE_INTEGER)

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
  multiplier: z
    .number()
    .refine((m) => (MULTIPLIERS as readonly number[]).includes(m), {
      message: "Multiplier must be 10,000 or 100,000",
    }),
  rows: z
    .array(
      z.object({
        domainKey: z.enum(FREQUENCY_DOMAIN_KEYS),
        termHits: countField,
        normalizerHits: countField.min(1, "Normalizer count must be above 0"),
        normalizerReusedFromId: z.number().int().optional(),
      })
    )
    .length(FREQUENCY_DOMAINS.length, "One row per domain is required")
    .refine(
      (rows) =>
        new Set(rows.map((r) => r.domainKey)).size === FREQUENCY_DOMAINS.length,
      { message: "Each domain must appear exactly once" }
    ),
})

export type FrequencyLookupInput = z.infer<typeof FrequencyLookupSchema>

export const domainByKey = (key: string) =>
  FREQUENCY_DOMAINS.find((d) => d.key === key)
