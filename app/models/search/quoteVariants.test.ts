import { describe, it, expect } from "vitest"
import type { Prisma } from "@prisma/client"
import {
  likePatterns,
  quoteVariants,
  straightenQuotes,
  termMatchSql,
} from "./quoteVariants"

describe("straightenQuotes", () => {
  it("turns every curly quote into its straight form", () => {
    expect(straightenQuotes("l’Acadie “quoted” ‘x’")).toBe(
      "l'Acadie \"quoted\" 'x'"
    )
  })
})

describe("quoteVariants", () => {
  it("returns a term with no quote character unchanged and alone", () => {
    expect(quoteVariants("aboiteau")).toEqual(["aboiteau"])
  })

  it("gives the straight and curly apostrophe for either input", () => {
    expect(quoteVariants("l'Acadie")).toEqual(["l'Acadie", "l’Acadie"])
    expect(quoteVariants("l’Acadie")).toEqual(["l'Acadie", "l’Acadie"])
  })

  it("gives the straight, opening and closing forms of a double quote", () => {
    expect(quoteVariants('say "eh"')).toEqual([
      'say "eh"',
      "say “eh“",
      "say ”eh”",
    ])
  })

  it("combines apostrophe and double-quote spellings", () => {
    expect(quoteVariants(`"l'Acadie"`)).toHaveLength(6)
  })
})

describe("likePatterns", () => {
  it("wraps each variant in wildcards", () => {
    expect(likePatterns("l'Acadie")).toEqual(["%l'Acadie%", "%l’Acadie%"])
  })

  it("is a lone wildcard for the match-everything search", () => {
    expect(likePatterns("*")).toEqual(["%"])
  })
})

describe("termMatchSql", () => {
  const render = (sql: Prisma.Sql) => ({ sql: sql.sql, values: sql.values })

  it("ORs every column against every quote spelling, case-insensitively", () => {
    const { sql, values } = render(
      termMatchSql(["headword", "spelling_variants"], "l'Acadie", false)
    )
    expect(sql).toBe(
      "(LOWER(headword) LIKE LOWER(?) OR LOWER(headword) LIKE LOWER(?) OR LOWER(spelling_variants) LIKE LOWER(?) OR LOWER(spelling_variants) LIKE LOWER(?))"
    )
    expect(values).toEqual([
      "%l'Acadie%",
      "%l’Acadie%",
      "%l'Acadie%",
      "%l’Acadie%",
    ])
  })

  it("drops LOWER() for a case-sensitive search", () => {
    const { sql, values } = render(termMatchSql(["fist_note"], "Eh", true))
    expect(sql).toBe("(fist_note LIKE ?)")
    expect(values).toEqual(["%Eh%"])
  })
})
