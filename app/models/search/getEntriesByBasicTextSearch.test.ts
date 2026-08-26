import { describe, it, expect, vi, beforeEach } from "vitest"
import {
  getEntriesByBasicTextSearch,
  getHeadwordCount,
  editingStatusHelper,
} from "./getEntriesByBasicTextSearch"
import { prisma } from "~/db.server"
import { SEARCH_WILDCARD } from "../search.server"
import type { SearchResultParams } from "../search.server"

// Mock prisma
vi.mock("~/db.server", () => ({
  prisma: {
    $queryRaw: vi.fn(),
  },
}))

describe("editingStatusHelper", () => {
  it("should return allStatuses=true when editingStatus is undefined", () => {
    const result = editingStatusHelper(undefined)
    expect(result.allStatuses).toBe(true)
    expect(result.statusMap).toEqual({})
  })

  it("should return allStatuses=true when editingStatus is empty array", () => {
    const result = editingStatusHelper([])
    expect(result.allStatuses).toBe(true)
    expect(result.statusMap).toEqual({})
  })

  it("should return allStatuses=false and correct statusMap when some statuses provided", () => {
    const result = editingStatusHelper(["first_draft", "revised_draft"])
    expect(result.allStatuses).toBe(false)
    expect(result.statusMap).toEqual({
      first_draft: true,
      revised_draft: true,
    })
  })
})

describe("getHeadwordCount", () => {
  const mockParams: SearchResultParams = {
    searchTerm: "test",
    database: ["dchp3"],
    canadianismType: [],
    editingStatus: [],
    nonCanadianism: false,
    caseSensitive: false,
    page: 1,
    attribute: "headword",
    isUserAdmin: false,
    take: 100,
    skip: 0,
    canadianismTypes: ["1. Origin", "2. Preservation"],
    versions: ["dchp3"],
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should execute query without canadianism filter when all types are selected", async () => {
    const params = {
      ...mockParams,
      canadianismTypes: [
        "1. Origin",
        "2. Preservation",
        "3. Semantic Change",
        "4. Culturally Significant",
        "5. Frequency",
        "6. Memorial",
      ],
    }

    vi.mocked(prisma.$queryRaw).mockResolvedValue([{ count: 10 }])

    const result = await getHeadwordCount(params)

    expect(prisma.$queryRaw).toHaveBeenCalledTimes(1)
    expect(result).toEqual([{ count: 10 }])
  })

  it("should execute query with canadianism filter when specific types are selected", async () => {
    const params = { ...mockParams, canadianismTypes: ["6. Memorial"] }

    vi.mocked(prisma.$queryRaw).mockResolvedValue([{ count: 5 }])

    const result = await getHeadwordCount(params)

    expect(prisma.$queryRaw).toHaveBeenCalledTimes(1)
    expect(result).toEqual([{ count: 5 }])
  })

  it("should handle wildcard search", async () => {
    const params = { ...mockParams, searchTerm: SEARCH_WILDCARD }

    vi.mocked(prisma.$queryRaw).mockResolvedValue([{ count: 100 }])

    await getHeadwordCount(params)

    expect(prisma.$queryRaw).toHaveBeenCalledTimes(1)
  })

  it("should handle case sensitive search", async () => {
    const params = { ...mockParams, caseSensitive: true }

    vi.mocked(prisma.$queryRaw).mockResolvedValue([{ count: 8 }])

    await getHeadwordCount(params)

    expect(prisma.$queryRaw).toHaveBeenCalledTimes(1)
  })

  it("should handle non-canadianism filter", async () => {
    const params = { ...mockParams, nonCanadianism: true }

    vi.mocked(prisma.$queryRaw).mockResolvedValue([{ count: 3 }])

    await getHeadwordCount(params)

    expect(prisma.$queryRaw).toHaveBeenCalledTimes(1)
  })

  it("should handle admin users", async () => {
    const params = { ...mockParams, isUserAdmin: true }

    vi.mocked(prisma.$queryRaw).mockResolvedValue([{ count: 15 }])

    await getHeadwordCount(params)

    expect(prisma.$queryRaw).toHaveBeenCalledTimes(1)
  })

  it("should handle multiple database versions", async () => {
    const params = {
      ...mockParams,
      database: ["dchp1", "dchp2", "dchp3"],
      versions: ["dchp1", "dchp2", "dchp3"],
    }

    vi.mocked(prisma.$queryRaw).mockResolvedValue([{ count: 25 }])

    await getHeadwordCount(params)

    expect(prisma.$queryRaw).toHaveBeenCalledTimes(1)
  })
})

describe("getEntriesByBasicTextSearch", () => {
  const mockParams: SearchResultParams = {
    searchTerm: "test",
    database: ["dchp3"],
    canadianismType: [],
    editingStatus: [],
    nonCanadianism: false,
    caseSensitive: false,
    page: 1,
    attribute: "headword",
    isUserAdmin: false,
    take: 100,
    skip: 0,
    canadianismTypes: ["1. Origin", "2. Preservation"],
    versions: ["dchp3"],
  }

  const mockEntries = [
    { id: 1, headword: "test1", is_public: true, dchp_version: "dchp3" },
    { id: 2, headword: "test2", is_public: true, dchp_version: "dchp3" },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should execute query without canadianism filter when all types are selected", async () => {
    const params = {
      ...mockParams,
      canadianismTypes: [
        "1. Origin",
        "2. Preservation",
        "3. Semantic Change",
        "4. Culturally Significant",
        "5. Frequency",
        "6. Memorial",
      ],
    }

    vi.mocked(prisma.$queryRaw).mockResolvedValue(mockEntries)

    const result = await getEntriesByBasicTextSearch(params)

    expect(result).toEqual(mockEntries)
    expect(prisma.$queryRaw).toHaveBeenCalledTimes(1)
    // $queryRaw is a tagged template, so the mock receives the template strings
    // array as its first argument and the interpolated values after it.
    const [strings] = vi.mocked(prisma.$queryRaw).mock.calls[0] as unknown as [
      TemplateStringsArray
    ]
    const sql = strings.join(" ")
    expect(sql).toContain("FROM det_entries de")
    expect(sql).not.toContain("INNER JOIN det_meanings")
  })

  it("should execute query with canadianism filter when specific types are selected", async () => {
    const params = { ...mockParams, canadianismTypes: ["6. Memorial"] }
    const mockFilteredEntries = [mockEntries[0]]

    vi.mocked(prisma.$queryRaw).mockResolvedValue(mockFilteredEntries)

    const result = await getEntriesByBasicTextSearch(params)

    expect(result).toEqual(mockFilteredEntries)
    expect(prisma.$queryRaw).toHaveBeenCalledTimes(1)
  })

  it("should handle pagination correctly", async () => {
    const params = { ...mockParams, take: 10, skip: 20 }

    vi.mocked(prisma.$queryRaw).mockResolvedValue(mockEntries)

    await getEntriesByBasicTextSearch(params)

    expect(prisma.$queryRaw).toHaveBeenCalledTimes(1)
  })

  it("should handle empty results", async () => {
    vi.mocked(prisma.$queryRaw).mockResolvedValue([])

    const result = await getEntriesByBasicTextSearch(mockParams)

    expect(result).toEqual([])
  })

  it("should handle wildcard search terms", async () => {
    const params = { ...mockParams, searchTerm: SEARCH_WILDCARD }

    vi.mocked(prisma.$queryRaw).mockResolvedValue(mockEntries)

    const result = await getEntriesByBasicTextSearch(params)

    expect(result).toEqual(mockEntries)
  })

  it("should handle case sensitive searches", async () => {
    const params = { ...mockParams, caseSensitive: true, searchTerm: "Test" }

    vi.mocked(prisma.$queryRaw).mockResolvedValue(mockEntries)

    const result = await getEntriesByBasicTextSearch(params)

    expect(result).toEqual(mockEntries)
  })

  it("should handle editing status filters", async () => {
    const params = {
      ...mockParams,
      editingStatus: ["first_draft", "revised_draft"],
    }

    vi.mocked(prisma.$queryRaw).mockResolvedValue(mockEntries)

    const result = await getEntriesByBasicTextSearch(params)

    expect(result).toEqual(mockEntries)
  })
})
