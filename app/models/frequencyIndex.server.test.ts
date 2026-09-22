// @vitest-environment node
import { FREQUENCY_DOMAINS } from "./frequencyIndex"

const create = vi.fn()
const findMany = vi.fn()
const rowFindMany = vi.fn()

vi.mock("~/db.server", () => ({
  prisma: {
    frequencyLookup: {
      create: (...a: unknown[]) => create(...a),
      findMany: (...a: unknown[]) => findMany(...a),
      findUnique: vi.fn(),
    },
    frequencyLookupRow: { findMany: (...a: unknown[]) => rowFindMany(...a) },
  },
}))

import {
  getRecentNormalizerCounts,
  saveFrequencyLookup,
} from "./frequencyIndex.server"

beforeEach(() => vi.clearAllMocks())

describe("saveFrequencyLookup", () => {
  it("stores the queries, counts and index for every domain", async () => {
    create.mockResolvedValue({ id: 42 })
    const rows = FREQUENCY_DOMAINS.map((d, i) => ({
      domainKey: d.key,
      termHits: 100 * (i + 1),
      normalizerHits: 25_000_000_000,
      normalizerReusedFromId: i === 0 ? 7 : undefined,
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
    const data = create.mock.calls[0][0].data
    expect(data.term).toBe("toque")
    expect(data.exclusions).toBe("monkey")
    expect(data.backend).toBe("browser")
    expect(data.user_id).toBe(3)
    expect(data.rows.create).toHaveLength(7)

    const ca = data.rows.create[0]
    expect(ca.domain_key).toBe("ca")
    expect(ca.term_query).toBe("toque -monkey site:.ca")
    expect(ca.normalizer_query).toBe("the site:.ca")
    expect(ca.term_hits).toBe(100n)
    expect(ca.normalizer_hits).toBe(25_000_000_000n)
    expect(ca.frequency_index).toBeCloseTo((100 / 25_000_000_000) * 10_000)
    expect(ca.normalizer_reused_from_id).toBe(7)
    expect(data.rows.create[1].normalizer_reused_from_id).toBeNull()
  })
})

describe("getRecentNormalizerCounts", () => {
  it("keeps the newest count per normalizer and domain", async () => {
    const day = (n: number) => new Date(2026, 8, n)
    rowFindMany.mockResolvedValue([
      {
        id: 11,
        domain_key: "ca",
        normalizer_hits: 500n,
        lookup: { normalizer: "the", created: day(20), term: "igloo" },
      },
      {
        id: 9,
        domain_key: "ca",
        normalizer_hits: 400n,
        lookup: { normalizer: "the", created: day(18), term: "toque" },
      },
      {
        id: 10,
        domain_key: "uk",
        normalizer_hits: 900n,
        lookup: { normalizer: "the", created: day(18), term: "toque" },
      },
      {
        id: 12,
        domain_key: "ca",
        normalizer_hits: 50n,
        lookup: { normalizer: "could", created: day(19), term: "toque" },
      },
    ])

    const recent = await getRecentNormalizerCounts()

    expect(recent.the.ca).toMatchObject({ rowId: 11, hits: 500, term: "igloo" })
    expect(recent.the.uk).toMatchObject({ rowId: 10, hits: 900 })
    expect(recent.could.ca).toMatchObject({ rowId: 12, hits: 50 })
    expect(
      rowFindMany.mock.calls[0][0].where.lookup.created.gte
    ).toBeInstanceOf(Date)
  })
})
