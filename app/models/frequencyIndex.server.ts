import { prisma } from "~/db.server"
import {
  BACKEND_BROWSER,
  FREQUENCY_DOMAINS,
  GOOGLE_HL,
  SOURCE_LOOKUP,
  frequencyIndex,
  normalizerQuery,
  siteClause,
  termQuery,
  domainByKey,
  type FrequencyLookupEditInput,
  type FrequencyLookupInput,
} from "./frequencyIndex"

// A normalizer count is an observation stored once, in
// det_frequency_normalizer_counts, whether it was read during a term
// lookup, reused by a later one, or imported. Lookup rows point at the
// observation they used and store nothing derived: the index is computed
// here, when read, so a corrected observation corrects every lookup that
// used it and nothing goes stale.
//
// Hit counts are BigInt in the database because Google's estimate for a
// normalizer like "the" on a large domain exceeds 32 bits. They are converted
// to Number here so route data serializes; every realistic count is far
// below Number.MAX_SAFE_INTEGER.

export const NORMALIZER_REUSE_DAYS = 7

export type UserName = {
  id: number
  first_name: string | null
  last_name: string | null
}

export type NormalizerCountView = {
  id: number
  normalizer: string
  domainKey: string
  hits: number
  /** Calendar date, YYYY-MM-DD. */
  observed: string
  source: string
  /** The lookup it was read during, if any. */
  lookup: { id: number; term: string } | null
  user: UserName
  updated: string | null
  updatedUser: UserName | null
}

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
  normalizerCount: NormalizerCountView
  /** False when the count was read during another lookup or imported. */
  readHere: boolean
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
  user: UserName
  /** Set when the counts or multiplier were corrected after saving. */
  updated: string | null
  updatedUser: UserName | null
  rows: FrequencyLookupRowView[]
}

/** The most recent observation per normalizer and domain, for prefilling. */
export type RecentNormalizerCounts = Record<
  string,
  Record<string, NormalizerCountView>
>

const USER_SELECT = { select: { id: true, first_name: true, last_name: true } }

const COUNT_INCLUDE = {
  user: USER_SELECT,
  updated_user: USER_SELECT,
  lookup: { select: { id: true, term: true } },
}

const LOOKUP_INCLUDE = {
  user: USER_SELECT,
  updated_user: USER_SELECT,
  rows: {
    orderBy: { id: "asc" as const },
    include: { normalizer_count: { include: COUNT_INCLUDE } },
  },
}

type LookupRecord = NonNullable<Awaited<ReturnType<typeof findLookupWithRows>>>
type CountRecord = LookupRecord["rows"][number]["normalizer_count"]

function findLookupWithRows(id: number) {
  return prisma.frequencyLookup.findUnique({
    where: { id },
    include: LOOKUP_INCLUDE,
  })
}

const dateOnly = (d: Date) => d.toISOString().slice(0, 10)

const countToView = (c: CountRecord): NormalizerCountView => ({
  id: c.id,
  normalizer: c.normalizer,
  domainKey: c.domain_key,
  hits: Number(c.hits),
  observed: dateOnly(c.observed),
  source: c.source,
  lookup: c.lookup,
  user: c.user,
  updated: c.updated?.toISOString() ?? null,
  updatedUser: c.updated_user,
})

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
  updated: lookup.updated?.toISOString() ?? null,
  updatedUser: lookup.updated_user,
  rows: lookup.rows.map((r) => {
    const count = countToView(r.normalizer_count)
    const domain = domainByKey(r.domain_key)
    return {
      id: r.id,
      domainKey: r.domain_key,
      domainLabel: r.domain_label,
      siteClause: r.site_clause,
      termQuery: r.term_query,
      normalizerQuery: domain
        ? normalizerQuery(count.normalizer, domain)
        : `${count.normalizer} ${r.site_clause}`,
      termHits: Number(r.term_hits),
      normalizerHits: count.hits,
      frequencyIndex:
        frequencyIndex(Number(r.term_hits), count.hits, lookup.multiplier) ?? 0,
      normalizerCount: count,
      readHere: r.normalizer_count.lookup_id === lookup.id,
    }
  }),
})

/** Today as a calendar date at UTC midnight, the form MySQL's DATE column keeps. */
const today = () => new Date(new Date().toISOString().slice(0, 10))

export async function saveFrequencyLookup({
  input,
  userId,
}: {
  input: FrequencyLookupInput
  userId: number
}) {
  const term = input.term.trim()
  const normalizer = input.normalizer.trim()
  const exclusions = input.exclusions?.trim() || null

  const reusedIds = input.rows
    .map((r) => r.normalizerCountId)
    .filter((id): id is number => id !== undefined)
  const reused = await prisma.frequencyNormalizerCount.findMany({
    where: { id: { in: reusedIds } },
  })

  return prisma.$transaction(async (tx) => {
    const lookup = await tx.frequencyLookup.create({
      data: {
        term,
        normalizer,
        exclusions,
        multiplier: input.multiplier,
        backend: BACKEND_BROWSER,
        hl: GOOGLE_HL,
        gl: null,
        user_id: userId,
        created: new Date(),
      },
      select: { id: true },
    })

    for (const domain of FREQUENCY_DOMAINS) {
      const row = input.rows.find((r) => r.domainKey === domain.key)
      if (!row) throw new Error(`Missing row for domain ${domain.key}`)

      // Reuse the observation only if it is what the form said it was; a
      // stale id or an edited value means a fresh reading.
      const hits = BigInt(row.normalizerHits)
      const existing = reused.find(
        (c) =>
          c.id === row.normalizerCountId &&
          c.normalizer === normalizer &&
          c.domain_key === domain.key &&
          c.hits === hits
      )
      const countId =
        existing?.id ??
        (
          await tx.frequencyNormalizerCount.create({
            data: {
              normalizer,
              domain_key: domain.key,
              hits,
              observed: today(),
              source: SOURCE_LOOKUP,
              lookup_id: lookup.id,
              user_id: userId,
              created: new Date(),
            },
            select: { id: true },
          })
        ).id

      await tx.frequencyLookupRow.create({
        data: {
          lookup_id: lookup.id,
          domain_key: domain.key,
          domain_label: domain.label,
          site_clause: siteClause(domain),
          term_query: termQuery(term, domain, exclusions),
          term_hits: BigInt(row.termHits),
          normalizer_count_id: countId,
        },
      })
    }

    return lookup.id
  })
}

/**
 * Correct the counts or multiplier of a saved lookup. A changed normalizer
 * count either corrects the observation in place, which changes every
 * lookup that used it, or becomes a new observation for this lookup alone,
 * as the input says per row.
 */
export async function updateFrequencyLookupCounts({
  id,
  input,
  userId,
}: {
  id: number
  input: FrequencyLookupEditInput
  userId: number
}) {
  const lookup = await findLookupWithRows(id)
  if (!lookup) return null

  await prisma.$transaction(async (tx) => {
    for (const existing of lookup.rows) {
      const row = input.rows.find((r) => r.domainKey === existing.domain_key)
      if (!row) throw new Error(`Missing row for domain ${existing.domain_key}`)

      const hits = BigInt(row.normalizerHits)
      let countId = existing.normalizer_count_id
      if (hits !== existing.normalizer_count.hits) {
        if (row.normalizerChange === "new") {
          countId = (
            await tx.frequencyNormalizerCount.create({
              data: {
                normalizer: existing.normalizer_count.normalizer,
                domain_key: existing.domain_key,
                hits,
                observed: today(),
                source: SOURCE_LOOKUP,
                lookup_id: lookup.id,
                user_id: userId,
                created: new Date(),
              },
              select: { id: true },
            })
          ).id
        } else {
          await tx.frequencyNormalizerCount.update({
            where: { id: existing.normalizer_count_id },
            data: { hits, updated: new Date(), updated_user_id: userId },
          })
        }
      }

      await tx.frequencyLookupRow.update({
        where: { id: existing.id },
        data: { term_hits: BigInt(row.termHits), normalizer_count_id: countId },
      })
    }

    await tx.frequencyLookup.update({
      where: { id },
      data: {
        multiplier: input.multiplier,
        updated: new Date(),
        updated_user_id: userId,
      },
    })
  })

  return id
}

/**
 * Delete a lookup and its rows. Observations read during it go too, unless
 * another lookup reused them, in which case they stay and lose their link to
 * this lookup.
 */
export async function deleteFrequencyLookup(id: number) {
  const readHere = await prisma.frequencyNormalizerCount.findMany({
    where: { lookup_id: id },
    select: { id: true },
  })
  const result = await prisma.frequencyLookup.deleteMany({ where: { id } })
  if (result.count === 0) return false
  await prisma.frequencyNormalizerCount.deleteMany({
    where: { id: { in: readHere.map((c) => c.id) }, rows: { none: {} } },
  })
  return true
}

/**
 * Delete a standalone observation. Refused, with the lookups that use it,
 * when any row points at it.
 */
export async function deleteNormalizerCount(
  id: number
): Promise<
  { deleted: true } | { deleted: false; usedBy: { id: number; term: string }[] }
> {
  const rows = await prisma.frequencyLookupRow.findMany({
    where: { normalizer_count_id: id },
    select: { lookup: { select: { id: true, term: true } } },
  })
  if (rows.length > 0)
    return { deleted: false, usedBy: rows.map((r) => r.lookup) }
  await prisma.frequencyNormalizerCount.deleteMany({ where: { id } })
  return { deleted: true }
}

export async function getFrequencyLookup(
  id: number
): Promise<FrequencyLookupView | null> {
  const lookup = await findLookupWithRows(id)
  return lookup ? toView(lookup) : null
}

/**
 * For each observation a lookup uses, the other lookups that use it too,
 * so the correction page can say what a correction would change.
 */
export async function getOtherUsersOfCounts(
  lookupId: number
): Promise<Record<number, { id: number; term: string }[]>> {
  const rows = await prisma.frequencyLookupRow.findMany({
    where: {
      lookup_id: { not: lookupId },
      normalizer_count: { rows: { some: { lookup_id: lookupId } } },
    },
    select: {
      normalizer_count_id: true,
      lookup: { select: { id: true, term: true } },
    },
  })
  const result: Record<number, { id: number; term: string }[]> = {}
  for (const r of rows) (result[r.normalizer_count_id] ??= []).push(r.lookup)
  return result
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
 * The newest observation in the last NORMALIZER_REUSE_DAYS per normalizer
 * and domain, whatever its source, so the form can prefill it instead of
 * asking the student to look up "the site:.ca" again for every term.
 */
export async function getRecentNormalizerCounts(): Promise<RecentNormalizerCounts> {
  const since = new Date(Date.now() - NORMALIZER_REUSE_DAYS * 24 * 3600 * 1000)
  const counts = await prisma.frequencyNormalizerCount.findMany({
    where: { observed: { gte: since } },
    include: COUNT_INCLUDE,
    orderBy: [{ observed: "desc" }, { id: "desc" }],
  })

  const result: RecentNormalizerCounts = {}
  for (const c of counts) {
    const byDomain = (result[c.normalizer] ??= {})
    if (byDomain[c.domain_key]) continue // newest already kept
    byDomain[c.domain_key] = countToView(c)
  }
  return result
}

/** One series per domain: every observation, oldest first. */
export type NormalizerHistory = Record<string, NormalizerCountView[]>

/** Normalizers that have ever been observed, most observed first. */
export async function listNormalizers(): Promise<
  { normalizer: string; counts: number }[]
> {
  const groups = await prisma.frequencyNormalizerCount.groupBy({
    by: ["normalizer"],
    _count: { _all: true },
    orderBy: [{ _count: { normalizer: "desc" } }, { normalizer: "asc" }],
  })
  return groups.map((g) => ({
    normalizer: g.normalizer,
    counts: g._count._all,
  }))
}

const emptyHistory = (): NormalizerHistory =>
  Object.fromEntries(FREQUENCY_DOMAINS.map((d) => [d.key, []]))

/**
 * Every observation since `since`, grouped by normalizer and then by
 * domain, oldest first. Pass a normalizer to fetch only that one.
 */
export async function getNormalizerHistories(
  since: Date | null,
  normalizer?: string
): Promise<Record<string, NormalizerHistory>> {
  const counts = await prisma.frequencyNormalizerCount.findMany({
    where: {
      ...(normalizer !== undefined ? { normalizer } : {}),
      ...(since ? { observed: { gte: since } } : {}),
    },
    include: COUNT_INCLUDE,
    orderBy: [{ observed: "asc" }, { id: "asc" }],
  })

  const histories: Record<string, NormalizerHistory> = {}
  for (const c of counts) {
    const history = (histories[c.normalizer] ??= emptyHistory())
    ;(history[c.domain_key] ??= []).push(countToView(c))
  }
  return histories
}

export async function getNormalizerHistory(
  normalizer: string,
  since: Date | null
): Promise<NormalizerHistory> {
  const histories = await getNormalizerHistories(since, normalizer)
  return histories[normalizer] ?? emptyHistory()
}
