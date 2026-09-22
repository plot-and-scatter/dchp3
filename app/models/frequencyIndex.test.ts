import {
  FREQUENCY_DOMAINS,
  FrequencyLookupSchema,
  digitsOnly,
  frequencyIndex,
  googleSearchUrl,
  normalizeExclusions,
  normalizerQuery,
  parseCount,
  termQuery,
} from "./frequencyIndex"

const ca = FREQUENCY_DOMAINS[0]
const us = FREQUENCY_DOMAINS[1]

describe("termQuery", () => {
  it("restricts to the domain", () => {
    expect(termQuery("toque", ca)).toBe("toque site:.ca")
  })

  it("groups the US top-level domains with OR", () => {
    expect(termQuery("toque", us)).toBe(
      "toque site:.edu OR site:.gov OR site:.mil OR site:.us"
    )
  })

  it("quotes a multi-word term", () => {
    expect(termQuery("double double", ca)).toBe('"double double" site:.ca')
  })

  it("does not double-quote an already quoted term", () => {
    expect(termQuery('"double double"', ca)).toBe('"double double" site:.ca')
  })

  it("adds exclusions before the site clause", () => {
    expect(termQuery("toque", ca, "monkey -site:example.com")).toBe(
      "toque -monkey -site:example.com site:.ca"
    )
  })
})

describe("normalizerQuery", () => {
  it("never carries exclusions", () => {
    expect(normalizerQuery("the", ca)).toBe("the site:.ca")
  })
})

describe("normalizeExclusions", () => {
  it("prefixes each token with a minus once", () => {
    expect(normalizeExclusions("  monkey   -hat site:x.com ")).toBe(
      "-monkey -hat -site:x.com"
    )
  })
  it("is empty for nothing", () => {
    expect(normalizeExclusions(undefined)).toBe("")
    expect(normalizeExclusions("   ")).toBe("")
  })
})

describe("googleSearchUrl", () => {
  it("pins the interface language", () => {
    expect(googleSearchUrl("toque site:.ca")).toBe(
      "https://www.google.com/search?q=toque+site%3A.ca&hl=en"
    )
  })
})

describe("count parsing", () => {
  it("keeps only digits from a pasted results line", () => {
    expect(digitsOnly("About 1,230,000 results (0.42 seconds)")).toBe("1230000")
    expect(parseCount("About 1,230,000 results")).toBe(1230000)
  })
  it("returns null for no digits", () => {
    expect(parseCount("")).toBeNull()
    expect(parseCount("no results")).toBeNull()
  })
  it("accepts counts above 32 bits", () => {
    expect(parseCount("25,000,000,000")).toBe(25_000_000_000)
  })
})

describe("frequencyIndex", () => {
  it("divides and scales", () => {
    expect(frequencyIndex(50, 1_000_000, 10_000)).toBeCloseTo(0.5)
    expect(frequencyIndex(50, 1_000_000, 100_000)).toBeCloseTo(5)
  })
  it("is null without both counts or with a zero normalizer", () => {
    expect(frequencyIndex(null, 10, 10_000)).toBeNull()
    expect(frequencyIndex(10, null, 10_000)).toBeNull()
    expect(frequencyIndex(10, 0, 10_000)).toBeNull()
  })
  it("allows zero term hits", () => {
    expect(frequencyIndex(0, 10, 10_000)).toBe(0)
  })
})

describe("FrequencyLookupSchema", () => {
  const rows = FREQUENCY_DOMAINS.map((d, i) => ({
    domainKey: d.key,
    termHits: i * 10,
    normalizerHits: 1000,
  }))
  const valid = { term: "toque", normalizer: "the", multiplier: 10_000, rows }

  it("accepts a complete lookup", () => {
    expect(FrequencyLookupSchema.safeParse(valid).success).toBe(true)
  })
  it("rejects a missing domain", () => {
    const r = FrequencyLookupSchema.safeParse({ ...valid, rows: rows.slice(1) })
    expect(r.success).toBe(false)
  })
  it("rejects a duplicated domain", () => {
    const dup = [...rows.slice(1), { ...rows[1] }]
    expect(
      FrequencyLookupSchema.safeParse({ ...valid, rows: dup }).success
    ).toBe(false)
  })
  it("rejects a zero normalizer count", () => {
    const zero = rows.map((r) => ({ ...r, normalizerHits: 0 }))
    expect(
      FrequencyLookupSchema.safeParse({ ...valid, rows: zero }).success
    ).toBe(false)
  })
  it("rejects an unknown multiplier", () => {
    expect(
      FrequencyLookupSchema.safeParse({ ...valid, multiplier: 5 }).success
    ).toBe(false)
  })
})
