// @vitest-environment node
import { FREQUENCY_DOMAINS } from "./frequencyIndex"

// Every prisma call the module makes is stubbed; $transaction runs the
// callback against the same stubs so the sequence of writes can be checked.
const lookup = {
  create: vi.fn(),
  findMany: vi.fn(),
  findUnique: vi.fn(),
  update: vi.fn(),
  deleteMany: vi.fn(),
  groupBy: vi.fn(),
}
const row = { create: vi.fn(), findMany: vi.fn(), update: vi.fn() }
const count = {
  create: vi.fn(),
  findMany: vi.fn(),
  update: vi.fn(),
  deleteMany: vi.fn(),
  groupBy: vi.fn(),
}
const stubs = {
  frequencyLookup: lookup,
  frequencyLookupRow: row,
  frequencyNormalizerCount: count,
}

// vi.mock is hoisted above the stubs, so the factory reaches them lazily.
vi.mock("~/db.server", () => ({
  prisma: new Proxy(
    {},
    {
      get: (_, key: string) =>
        key === "$transaction"
          ? (fn: (tx: typeof stubs) => unknown) => fn(stubs)
          : stubs[key as keyof typeof stubs],
    }
  ),
}))

// eslint-disable-next-line import/first
import {
  deleteFrequencyLookup,
  deleteNormalizerCount,
  getNormalizerHistories,
  getNormalizerHistory,
  getRecentNormalizerCounts,
  saveFrequencyLookup,
  updateFrequencyLookupCounts,
} from "./frequencyIndex.server"

const user = { id: 3, first_name: "Nat", last_name: "M" }
const day = (n: number) => new Date(Date.UTC(2026, 8, n))

const countRecord = (over: Partial<Record<string, unknown>> = {}) => ({
  id: 50,
  normalizer: "the",
  domain_key: "ca",
  hits: 1000n,
  observed: day(1),
  source: "lookup",
  lookup_id: 10,
  lookup: { id: 10, term: "toque" },
  user,
  updated: null,
  updated_user: null,
  ...over,
})

beforeEach(() => {
  vi.clearAllMocks()
  let nextId = 900
  count.create.mockImplementation(async () => ({ id: nextId++ }))
  row.create.mockResolvedValue({})
  row.update.mockResolvedValue({})
  count.update.mockResolvedValue({})
  lookup.update.mockResolvedValue({})
})

describe("saveFrequencyLookup", () => {
  it("creates an observation per fresh count and reuses the ones it was given", async () => {
    lookup.create.mockResolvedValue({ id: 42 })
    count.findMany.mockResolvedValue([
      countRecord({ id: 7, domain_key: "ca", hits: 25_000_000_000n }),
    ])
    const rows = FREQUENCY_DOMAINS.map((d, i) => ({
      domainKey: d.key,
      termHits: 100 * (i + 1),
      normalizerHits: 25_000_000_000,
      normalizerCountId: i === 0 ? 7 : undefined,
    }))

    const id = await saveFrequencyLookup({
      userId: 3,
      input: {
        term: " toque ",
        normalizer: "the",
        exclusions: "monkey",
        multiplier: 10_000,
        rows,
      },
    })

    expect(id).toBe(42)
    const data = lookup.create.mock.calls[0][0].data
    expect(data.term).toBe("toque")
    expect(data.exclusions).toBe("monkey")
    expect(data.backend).toBe("browser")
    expect(data.user_id).toBe(3)

    // Six fresh observations, all linked to this lookup, none for Canada.
    expect(count.create).toHaveBeenCalledTimes(6)
    for (const call of count.create.mock.calls) {
      expect(call[0].data.lookup_id).toBe(42)
      expect(call[0].data.source).toBe("lookup")
      expect(call[0].data.domain_key).not.toBe("ca")
      expect(call[0].data.hits).toBe(25_000_000_000n)
    }

    expect(row.create).toHaveBeenCalledTimes(7)
    const ca = row.create.mock.calls[0][0].data
    expect(ca.domain_key).toBe("ca")
    expect(ca.term_query).toBe("toque -monkey site:.ca")
    expect(ca.term_hits).toBe(100n)
    expect(ca.normalizer_count_id).toBe(7)
    expect(ca).not.toHaveProperty("frequency_index")
    expect(row.create.mock.calls[1][0].data.normalizer_count_id).toBe(900)
  })

  it("takes a fresh reading when the reused id no longer matches the count", async () => {
    lookup.create.mockResolvedValue({ id: 43 })
    count.findMany.mockResolvedValue([countRecord({ id: 7, hits: 999n })])
    const rows = FREQUENCY_DOMAINS.map((d, i) => ({
      domainKey: d.key,
      termHits: 1,
      normalizerHits: 1000,
      normalizerCountId: i === 0 ? 7 : undefined,
    }))
    await saveFrequencyLookup({
      userId: 3,
      input: { term: "toque", normalizer: "the", multiplier: 10_000, rows },
    })
    expect(count.create).toHaveBeenCalledTimes(7)
    expect(row.create.mock.calls[0][0].data.normalizer_count_id).toBe(900)
  })
})

describe("updateFrequencyLookupCounts", () => {
  const stored = () => ({
    id: 5,
    multiplier: 10_000,
    rows: FREQUENCY_DOMAINS.map((d, i) => ({
      id: 100 + i,
      domain_key: d.key,
      term_hits: 10n,
      normalizer_count_id: 50 + i,
      normalizer_count: countRecord({ id: 50 + i, domain_key: d.key }),
    })),
  })

  it("corrects a shared observation in place and stores nothing derived", async () => {
    lookup.findUnique.mockResolvedValue(stored())
    const rows = FREQUENCY_DOMAINS.map((d, i) => ({
      domainKey: d.key,
      termHits: 20,
      normalizerHits: i === 0 ? 2000 : 1000, // only Canada's normalizer changes
      normalizerChange: "correct" as const,
    }))

    const id = await updateFrequencyLookupCounts({
      id: 5,
      userId: 9,
      input: { multiplier: 1_000_000, rows },
    })

    expect(id).toBe(5)
    expect(count.update).toHaveBeenCalledTimes(1)
    expect(count.update.mock.calls[0][0]).toMatchObject({
      where: { id: 50 },
      data: { hits: 2000n, updated_user_id: 9 },
    })
    expect(count.create).not.toHaveBeenCalled()

    expect(row.update).toHaveBeenCalledTimes(7)
    const ca = row.update.mock.calls[0][0]
    expect(ca.where).toEqual({ id: 100 })
    expect(ca.data).toEqual({ term_hits: 20n, normalizer_count_id: 50 })

    expect(lookup.update.mock.calls[0][0]).toMatchObject({
      where: { id: 5 },
      data: { multiplier: 1_000_000, updated_user_id: 9 },
    })
  })

  it("makes a new observation for this lookup alone when asked", async () => {
    lookup.findUnique.mockResolvedValue(stored())
    const rows = FREQUENCY_DOMAINS.map((d, i) => ({
      domainKey: d.key,
      termHits: 10,
      normalizerHits: i === 0 ? 2000 : 1000,
      normalizerChange: (i === 0 ? "new" : "correct") as "new" | "correct",
    }))

    await updateFrequencyLookupCounts({
      id: 5,
      userId: 9,
      input: { multiplier: 10_000, rows },
    })

    expect(count.update).not.toHaveBeenCalled()
    expect(count.create).toHaveBeenCalledTimes(1)
    expect(count.create.mock.calls[0][0].data).toMatchObject({
      normalizer: "the",
      domain_key: "ca",
      hits: 2000n,
      lookup_id: 5,
      user_id: 9,
    })
    expect(row.update.mock.calls[0][0].data.normalizer_count_id).toBe(900)
  })

  it("returns null for an unknown lookup", async () => {
    lookup.findUnique.mockResolvedValue(null)
    const result = await updateFrequencyLookupCounts({
      id: 404,
      userId: 9,
      input: { multiplier: 10_000, rows: [] },
    })
    expect(result).toBeNull()
    expect(row.update).not.toHaveBeenCalled()
  })
})

describe("deleteFrequencyLookup", () => {
  it("removes the lookup and the observations read during it that nothing else uses", async () => {
    count.findMany.mockResolvedValue([{ id: 50 }, { id: 51 }])
    lookup.deleteMany.mockResolvedValue({ count: 1 })
    count.deleteMany.mockResolvedValue({ count: 1 })

    expect(await deleteFrequencyLookup(5)).toBe(true)
    expect(count.findMany.mock.calls[0][0].where).toEqual({ lookup_id: 5 })
    expect(count.deleteMany.mock.calls[0][0].where).toEqual({
      id: { in: [50, 51] },
      rows: { none: {} },
    })
  })

  it("is false, and deletes nothing else, when the lookup is unknown", async () => {
    count.findMany.mockResolvedValue([])
    lookup.deleteMany.mockResolvedValue({ count: 0 })
    expect(await deleteFrequencyLookup(404)).toBe(false)
    expect(count.deleteMany).not.toHaveBeenCalled()
  })
})

describe("deleteNormalizerCount", () => {
  it("refuses while a lookup uses the observation", async () => {
    row.findMany.mockResolvedValue([{ lookup: { id: 10, term: "toque" } }])
    expect(await deleteNormalizerCount(50)).toEqual({
      deleted: false,
      usedBy: [{ id: 10, term: "toque" }],
    })
    expect(count.deleteMany).not.toHaveBeenCalled()
  })

  it("deletes an unused observation", async () => {
    row.findMany.mockResolvedValue([])
    count.deleteMany.mockResolvedValue({ count: 1 })
    expect(await deleteNormalizerCount(50)).toEqual({ deleted: true })
    expect(count.deleteMany.mock.calls[0][0].where).toEqual({ id: 50 })
  })
})

describe("getRecentNormalizerCounts", () => {
  it("keeps the newest observation per normalizer and domain, from any source", async () => {
    count.findMany.mockResolvedValue([
      countRecord({ id: 11, domain_key: "ca", hits: 500n, observed: day(20) }),
      countRecord({
        id: 9,
        domain_key: "ca",
        hits: 400n,
        observed: day(18),
        source: "spreadsheet",
        lookup_id: null,
        lookup: null,
      }),
      countRecord({ id: 10, domain_key: "uk", hits: 900n, observed: day(18) }),
      countRecord({
        id: 12,
        normalizer: "could",
        domain_key: "ca",
        hits: 50n,
        observed: day(19),
      }),
    ])

    const recent = await getRecentNormalizerCounts()

    expect(recent.the.ca).toMatchObject({
      id: 11,
      hits: 500,
      observed: "2026-09-20",
      lookup: { term: "toque" },
    })
    expect(recent.the.uk).toMatchObject({ id: 10, hits: 900 })
    expect(recent.could.ca).toMatchObject({ id: 12, hits: 50 })
    expect(count.findMany.mock.calls[0][0].where.observed.gte).toBeInstanceOf(
      Date
    )
  })
})

describe("getNormalizerHistory", () => {
  it("groups observations by domain in date order and asks for one normalizer", async () => {
    count.findMany.mockResolvedValue([
      countRecord({ id: 1, domain_key: "ca", hits: 400n, observed: day(1) }),
      countRecord({
        id: 2,
        domain_key: "ca",
        hits: 450n,
        observed: day(8),
        source: "spreadsheet",
        lookup_id: null,
        lookup: null,
      }),
      countRecord({ id: 3, domain_key: "uk", hits: 900n, observed: day(1) }),
    ])

    const since = day(0)
    const history = await getNormalizerHistory("the", since)

    expect(history.ca.map((p) => p.hits)).toEqual([400, 450])
    expect(history.ca[1]).toMatchObject({
      id: 2,
      lookup: null,
      source: "spreadsheet",
      observed: "2026-09-08",
    })
    expect(history.uk).toHaveLength(1)
    expect(history.ie).toEqual([])

    expect(count.findMany.mock.calls[0][0].where).toEqual({
      normalizer: "the",
      observed: { gte: since },
    })
  })

  it("puts no date bound on an all-time request", async () => {
    count.findMany.mockResolvedValue([])
    await getNormalizerHistory("could", null)
    expect(count.findMany.mock.calls[0][0].where).toEqual({
      normalizer: "could",
    })
  })

  it("returns every normalizer when none is named", async () => {
    count.findMany.mockResolvedValue([
      countRecord({ id: 1, hits: 400n }),
      countRecord({ id: 2, normalizer: "could", hits: 40n }),
    ])
    const histories = await getNormalizerHistories(day(0))
    expect(Object.keys(histories).sort()).toEqual(["could", "the"])
    expect(histories.could.ca[0].hits).toBe(40)
    expect(count.findMany.mock.calls[0][0].where).not.toHaveProperty(
      "normalizer"
    )
  })
})
