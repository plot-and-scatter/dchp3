import { prisma } from "~/db.server"
import {
  BACKEND_BROWSER,
  FREQUENCY_DOMAINS,
  GOOGLE_HL,
  frequencyIndex,
  normalizerQuery,
  siteClause,
  termQuery,
  type FrequencyLookupInput,
} from "./frequencyIndex"

// Hit counts are BigInt in the database because Google's estimate for a
// normalizer like "the" on a large domain exceeds 32 bits. They are converted
// to Number here so route data serializes; every realistic count is far
// below Number.MAX_SAFE_INTEGER.

export const NORMALIZER_REUSE_DAYS = 7

export type FrequencyLookupRowView = {
  id: number
  domainKey: string
  domainLabel: string
  siteClause: string
  termQuery: string
  normalizerQuery: string
  termHits: number
  normalizerHits: number
  frequencyIndex: number
  normalizerReusedFromId: number | null
}

export type FrequencyLookupView = {
  id: number
  term: string
  normalizer: string
  exclusions: string | null
  multiplier: number
  backend: string
  hl: string | null
  gl: string | null
  created: string
  user: { id: number; first_name: string | null; last_name: string | null }
  rows: FrequencyLookupRowView[]
}

/** The most recent saved normalizer count per normalizer and domain. */
export type RecentNormalizerCounts = Record<
  string,
  Record<string, { rowId: number; hits: number; created: string; term: string }>
>

const LOOKUP_INCLUDE = {
  user: { select: { id: true, first_name: true, last_name: true } },
  rows: { orderBy: { id: "asc" as const } },
}

type LookupRecord = NonNullable<Awaited<ReturnType<typeof findLookupWithRows>>>

function findLookupWithRows(id: number) {
  return prisma.frequencyLookup.findUnique({
    where: { id },
    include: LOOKUP_INCLUDE,
  })
}

const toView = (lookup: LookupRecord): FrequencyLookupView => ({
  id: lookup.id,
  term: lookup.term,
  normalizer: lookup.normalizer,
  exclusions: lookup.exclusions,
  multiplier: lookup.multiplier,
  backend: lookup.backend,
  hl: lookup.hl,
  gl: lookup.gl,
  created: lookup.created.toISOString(),
  user: lookup.user,
  rows: lookup.rows.map((r) => ({
    id: r.id,
    domainKey: r.domain_key,
    domainLabel: r.domain_label,
    siteClause: r.site_clause,
    termQuery: r.term_query,
    normalizerQuery: r.normalizer_query,
    termHits: Number(r.term_hits),
    normalizerHits: Number(r.normalizer_hits),
    frequencyIndex: r.frequency_index,
    normalizerReusedFromId: r.normalizer_reused_from_id,
  })),
})

export async function saveFrequencyLookup({
  input,
  userId,
}: {
  input: FrequencyLookupInput
  userId: number
}) {
  const exclusions = input.exclusions?.trim() || null

  const rows = FREQUENCY_DOMAINS.map((domain) => {
    const row = input.rows.find((r) => r.domainKey === domain.key)
    if (!row) throw new Error(`Missing row for domain ${domain.key}`)
    const index = frequencyIndex(
      row.termHits,
      row.normalizerHits,
      input.multiplier
    )
    if (index === null)
      throw new Error(`Cannot compute index for domain ${domain.key}`)
    return {
      domain_key: domain.key,
      domain_label: domain.label,
      site_clause: siteClause(domain),
      term_query: termQuery(input.term, domain, exclusions),
      normalizer_query: normalizerQuery(input.normalizer, domain),
      term_hits: BigInt(row.termHits),
      normalizer_hits: BigInt(row.normalizerHits),
      frequency_index: index,
      normalizer_reused_from_id: row.normalizerReusedFromId ?? null,
    }
  })

  const lookup = await prisma.frequencyLookup.create({
    data: {
      term: input.term.trim(),
      normalizer: input.normalizer.trim(),
      exclusions,
      multiplier: input.multiplier,
      backend: BACKEND_BROWSER,
      hl: GOOGLE_HL,
      gl: null,
      user_id: userId,
      created: new Date(),
      rows: { create: rows },
    },
    select: { id: true },
  })

  return lookup.id
}

export async function getFrequencyLookup(
  id: number
): Promise<FrequencyLookupView | null> {
  const lookup = await findLookupWithRows(id)
  return lookup ? toView(lookup) : null
}

export async function listRecentFrequencyLookups(
  take = 25
): Promise<FrequencyLookupView[]> {
  const lookups = await prisma.frequencyLookup.findMany({
    orderBy: { created: "desc" },
    take,
    include: LOOKUP_INCLUDE,
  })
  return lookups.map(toView)
}

/**
 * Normalizer counts saved in the last NORMALIZER_REUSE_DAYS, newest first per
 * normalizer and domain, so the form can prefill them instead of asking the
 * student to look up "the site:.ca" again for every term.
 */
export async function getRecentNormalizerCounts(): Promise<RecentNormalizerCounts> {
  const since = new Date(Date.now() - NORMALIZER_REUSE_DAYS * 24 * 3600 * 1000)
  const rows = await prisma.frequencyLookupRow.findMany({
    where: { lookup: { created: { gte: since } } },
    include: {
      lookup: { select: { normalizer: true, created: true, term: true } },
    },
    orderBy: { lookup: { created: "desc" } },
  })

  const result: RecentNormalizerCounts = {}
  for (const row of rows) {
    const byDomain = (result[row.lookup.normalizer] ??= {})
    if (byDomain[row.domain_key]) continue // newest already kept
    byDomain[row.domain_key] = {
      rowId: row.id,
      hits: Number(row.normalizer_hits),
      created: row.lookup.created.toISOString(),
      term: row.lookup.term,
    }
  }
  return result
}
