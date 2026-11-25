import {
  COMBINED_SEARCHES,
  FREQUENCY_DOMAINS,
  FREQUENCY_SEARCHES,
  addCounts,
  countryKeyOf,
  historySeries,
  isCombinedSearchKey,
  searchByKey,
  searchesOf,
  FrequencyLookupEditSchema,
  FrequencyLookupSchema,
  MULTIPLIERS,
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

  it("quotes each side of AND so both words are required", () => {
    expect(termQuery("toque AND hockey", ca)).toBe('"toque" "hockey" site:.ca')
    expect(termQuery('"double double" AND toque', ca)).toBe(
      '"double double" "toque" site:.ca'
    )
  })

  it("puts the alternatives joined by OR in brackets, each one quoted", () => {
    expect(termQuery("EU OR European Union", ca)).toBe(
      '("EU" OR "European Union") site:.ca'
    )
    expect(termQuery('toque OR "tuque" OR touque', ca)).toBe(
      '("toque" OR "tuque" OR "touque") site:.ca'
    )
  })

  it("reads OR before AND", () => {
    expect(termQuery("associate member AND EU OR European Union", ca)).toBe(
      '"associate member" ("EU" OR "European Union") site:.ca'
    )
    expect(termQuery("toque OR tuque AND hockey OR curling", ca)).toBe(
      '("toque" OR "tuque") ("hockey" OR "curling") site:.ca'
    )
  })

  it("keeps the exclusions and the US domain group after an OR term", () => {
    expect(termQuery("EU OR European Union", us, "monkey")).toBe(
      '("EU" OR "European Union") -monkey site:.edu OR site:.gov OR site:.mil OR site:.us'
    )
  })

  it("leaves a lower-case or, and a fully quoted term, alone", () => {
    expect(termQuery("sink or swim", ca)).toBe('"sink or swim" site:.ca')
    expect(termQuery('"sink OR swim"', ca)).toBe('"sink OR swim" site:.ca')
    expect(termQuery('"rock AND roll"', ca)).toBe('"rock AND roll" site:.ca')
  })

  it("leaves a lower-case and inside a phrase alone", () => {
    expect(termQuery("rock and roll", ca)).toBe('"rock and roll" site:.ca')
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
  it("keeps a quoted phrase together", () => {
    expect(normalizeExclusions('"skate bag" rollerblades')).toBe(
      '-"skate bag" -rollerblades'
    )
    expect(normalizeExclusions('-"skate bag"')).toBe('-"skate bag"')
  })
  it("treats commas between pieces as spaces", () => {
    expect(normalizeExclusions('"skate bag", rollerblades,hockey')).toBe(
      '-"skate bag" -rollerblades -hockey'
    )
  })
  it("drops empty quotes", () => {
    expect(normalizeExclusions('"" monkey')).toBe("-monkey")
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
  const rows = FREQUENCY_SEARCHES.map((d, i) => ({
    domainKey: d.key,
    termHits: i * 10,
    normalizerHits: 1000,
  }))
  const valid = { term: "toque", normalizer: "the", multiplier: 10_000, rows }

  it("accepts a complete lookup", () => {
    expect(FrequencyLookupSchema.safeParse(valid).success).toBe(true)
  })
  it("asks for one row per search, so four for the US and ten in all", () => {
    expect(rows.map((r) => r.domainKey)).toEqual([
      "ca",
      "us.edu",
      "us.gov",
      "us.mil",
      "us.us",
      "uk",
      "ie",
      "nz",
      "au",
      "za",
    ])
  })
  it("rejects the US as one combined row", () => {
    const combined = [
      ...rows.filter((r) => !r.domainKey.startsWith("us.")),
      { domainKey: "us", termHits: 1, normalizerHits: 1000 },
    ]
    expect(
      FrequencyLookupSchema.safeParse({ ...valid, rows: combined }).success
    ).toBe(false)
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
      FrequencyLookupSchema.safeParse({ ...valid, multiplier: 1_000_000_000 })
        .success
    ).toBe(false)
    expect(
      FrequencyLookupSchema.safeParse({ ...valid, multiplier: 5 }).success
    ).toBe(false)
  })
  it("accepts every listed multiplier, up to one hundred million", () => {
    for (const multiplier of MULTIPLIERS)
      expect(
        FrequencyLookupSchema.safeParse({ ...valid, multiplier }).success
      ).toBe(true)
    expect(MULTIPLIERS).toContain(1_000_000)
  })
})

describe("FrequencyLookupEditSchema", () => {
  const rows = FREQUENCY_DOMAINS.map((d, i) => ({
    domainKey: d.key,
    termHits: i * 10,
    normalizerHits: 1000,
  }))

  it("accepts counts and a multiplier without the term, defaulting to a correction", () => {
    const r = FrequencyLookupEditSchema.safeParse({
      multiplier: 1_000_000,
      rows: [{ ...rows[0], normalizerChange: "new" }, ...rows.slice(1)],
    })
    expect(r.success).toBe(true)
    const parsed = r.success ? r.data.rows : []
    expect(parsed[0]?.normalizerChange).toBe("new")
    expect(parsed[1]?.normalizerChange).toBe("correct")
  })
  it("rejects an unknown kind of normalizer change", () => {
    expect(
      FrequencyLookupEditSchema.safeParse({
        multiplier: 10_000,
        rows: rows.map((r) => ({ ...r, normalizerChange: "maybe" })),
      }).success
    ).toBe(false)
  })
  // The correction page sends the rows the saved lookup has: seven for a
  // lookup saved when the US was one combined search, ten since. The save
  // itself refuses a correction that leaves out a stored row.
  it("accepts the ten rows of a lookup saved now", () => {
    expect(
      FrequencyLookupEditSchema.safeParse({
        multiplier: 10_000,
        rows: FREQUENCY_SEARCHES.map((d) => ({
          domainKey: d.key,
          termHits: 1,
          normalizerHits: 1000,
        })),
      }).success
    ).toBe(true)
  })
  it("rejects no rows, and the same row twice", () => {
    expect(
      FrequencyLookupEditSchema.safeParse({ multiplier: 10_000, rows: [] })
        .success
    ).toBe(false)
    expect(
      FrequencyLookupEditSchema.safeParse({
        multiplier: 10_000,
        rows: [rows[0], rows[0]],
      }).success
    ).toBe(false)
  })
})

describe("searches", () => {
  it("gives the US one search per domain and every other country one", () => {
    expect(searchesOf("us").map((s) => [s.key, s.label, s.tlds])).toEqual([
      ["us.edu", "USA .edu", [".edu"]],
      ["us.gov", "USA .gov", [".gov"]],
      ["us.mil", "USA .mil", [".mil"]],
      ["us.us", "USA .us", [".us"]],
    ])
    expect(searchesOf("ca").map((s) => s.key)).toEqual(["ca"])
    expect(FREQUENCY_SEARCHES).toHaveLength(10)
  })

  it("searches one domain at a time, with no OR", () => {
    const gov = searchByKey("us.gov")!
    expect(termQuery("toque", gov, "monkey")).toBe("toque -monkey site:.gov")
    expect(normalizerQuery("the", gov)).toBe("the site:.gov")
    for (const s of FREQUENCY_SEARCHES)
      expect(termQuery("toque", s)).not.toContain(" OR ")
  })

  it("knows which country a stored key belongs to, old or new", () => {
    expect(countryKeyOf("us.mil")).toBe("us")
    expect(countryKeyOf("us")).toBe("us")
    expect(countryKeyOf("ca")).toBe("ca")
    expect(isCombinedSearchKey("us")).toBe(true)
    expect(isCombinedSearchKey("us.us")).toBe(false)
    expect(isCombinedSearchKey("ca")).toBe(false)
    expect(COMBINED_SEARCHES.map((d) => d.key)).toEqual(["us"])
  })

  it("adds up counts only when every one is known", () => {
    expect(addCounts([181_000, 14_400, 252, 105_000])).toBe(300_652)
    expect(addCounts([181_000, null, 252, 105_000])).toBeNull()
    expect(addCounts([0, 0])).toBe(0)
    expect(addCounts([])).toBeNull()
  })

  it("lists the old combined US series in a history only when it has counts", () => {
    expect(historySeries({}).map((s) => s.key)).toEqual(
      FREQUENCY_SEARCHES.map((s) => s.key)
    )
    const withOld = historySeries({ us: [{}], ca: [{}] })
    expect(withOld).toHaveLength(11)
    expect(withOld[10]).toEqual({
      key: "us",
      label: "USA, one combined search (no longer used)",
    })
  })
})
