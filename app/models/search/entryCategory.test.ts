import { describe, expect, it } from "vitest"
import { BASE_CANADANISM_TYPES } from "~/types/CanadianismTypeEnum"
import { allTypesChecked, categorySql, categoryWhere } from "./entryCategory"

const all = [...BASE_CANADANISM_TYPES]

describe("categorySql", () => {
  it("lets every entry through when all seven boxes are checked", () => {
    const sql = categorySql({ nonCanadianism: true, canadianismTypes: all })
    expect(sql.sql).toBe(
      "((de.no_cdn_conf = 1 AND ?) OR (de.no_cdn_conf = 0 AND TRUE))"
    )
    expect(sql.values).toEqual([true])
  })

  it("keeps only confirmed non-Canadianisms when only that box is checked", () => {
    const sql = categorySql({ nonCanadianism: true, canadianismTypes: [] })
    expect(sql.sql).toBe(
      "((de.no_cdn_conf = 1 AND ?) OR (de.no_cdn_conf = 0 AND FALSE))"
    )
    expect(sql.values).toEqual([true])
  })

  it("keeps only Canadian entries with a checked type when that box is off", () => {
    const sql = categorySql({
      nonCanadianism: false,
      canadianismTypes: ["6. Memorial"],
    })
    expect(sql.sql).toBe(
      "((de.no_cdn_conf = 1 AND ?) OR (de.no_cdn_conf = 0 AND EXISTS (SELECT 1 FROM det_meanings dmc WHERE dmc.entry_id = de.id AND dmc.canadianism_type IN (?))))"
    )
    expect(sql.values).toEqual([false, "6. Memorial"])
  })

  it("tests the row's own type for a meaning-level query", () => {
    const sql = categorySql(
      {
        nonCanadianism: undefined,
        canadianismTypes: ["1. Origin", "6. Memorial"],
      },
      "det_meanings"
    )
    expect(sql.sql).toBe(
      "((de.no_cdn_conf = 1 AND ?) OR (de.no_cdn_conf = 0 AND det_meanings.canadianism_type IN (?,?)))"
    )
    expect(sql.values).toEqual([false, "1. Origin", "6. Memorial"])
  })

  it("matches nothing at all when no box is checked", () => {
    const sql = categorySql({ nonCanadianism: null, canadianismTypes: [] })
    expect(sql.sql).toBe(
      "((de.no_cdn_conf = 1 AND ?) OR (de.no_cdn_conf = 0 AND FALSE))"
    )
    expect(sql.values).toEqual([false])
  })
})

describe("categoryWhere", () => {
  it("has a non-Canadian branch only when that box is checked", () => {
    expect(
      categoryWhere({ nonCanadianism: true, canadianismTypes: all })
    ).toEqual({
      OR: [{ entry: { no_cdn_conf: true } }, { entry: { no_cdn_conf: false } }],
    })
    expect(
      categoryWhere({ nonCanadianism: false, canadianismTypes: ["1. Origin"] })
    ).toEqual({
      OR: [
        {
          entry: { no_cdn_conf: false },
          canadianism_type: { in: ["1. Origin"] },
        },
      ],
    })
  })

  it("matches no Canadian meaning when no type is checked", () => {
    expect(
      categoryWhere({ nonCanadianism: true, canadianismTypes: [] })
    ).toEqual({
      OR: [
        { entry: { no_cdn_conf: true } },
        { entry: { no_cdn_conf: false }, canadianism_type: { in: [] } },
      ],
    })
  })
})

describe("allTypesChecked", () => {
  it("is true only when every base type is present", () => {
    expect(allTypesChecked({ canadianismTypes: all })).toBe(true)
    expect(allTypesChecked({ canadianismTypes: all.slice(1) })).toBe(false)
    expect(allTypesChecked({ canadianismTypes: [...all, "extra"] })).toBe(true)
    expect(allTypesChecked({})).toBe(false)
  })
})
