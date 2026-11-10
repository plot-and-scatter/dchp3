import { Prisma } from "@prisma/client"
import { SEARCH_WILDCARD } from "../search.server"

// Natalia (Nov 2026): the spelling variant l’Acadie only found the Acadia
// entry when the search used a curly apostrophe. The database holds both
// kinds, so a search has to match whichever kind the editor happened to type.
// The term is matched against every spelling of its quote characters instead
// of normalizing the data, which would mean a migration of 80,000 quotations.

// Single quotes and apostrophes: ‘ ’ ‚ ‛ ′ ʼ
const CURLY_APOSTROPHES = /[‘’‚‛′ʼ]/g
// Double quotes: “ ” „ ‟ ″
const CURLY_DOUBLE_QUOTES = /[“”„‟″]/g

const APOSTROPHE_SPELLINGS = ["'", "’"]
const DOUBLE_QUOTE_SPELLINGS = ['"', "“", "”"]

/** The text with every quote character in its straight ASCII form. */
export function straightenQuotes(text: string): string {
  return text.replace(CURLY_APOSTROPHES, "'").replace(CURLY_DOUBLE_QUOTES, '"')
}

/**
 * The spellings of the term that differ only in their quote characters: the
 * straight form, the curly-apostrophe form, and the opening- and closing-quote
 * forms for double quotes. A term with no quote character is returned alone.
 */
export function quoteVariants(term: string): string[] {
  const straight = straightenQuotes(term)
  if (!/['"]/.test(straight)) return [term]

  const variants = new Set<string>()
  for (const apostrophe of APOSTROPHE_SPELLINGS) {
    for (const doubleQuote of DOUBLE_QUOTE_SPELLINGS) {
      variants.add(
        straight.replace(/'/g, apostrophe).replace(/"/g, doubleQuote)
      )
    }
  }
  return [...variants]
}

/** `%term%` for each quote variant, or a lone `%` for the wildcard search. */
export function likePatterns(searchTerm: string): string[] {
  return searchTerm === SEARCH_WILDCARD
    ? ["%"]
    : quoteVariants(searchTerm).map((variant) => `%${variant}%`)
}

/**
 * A WHERE fragment that is true when any of the columns contains the term in
 * any of its quote spellings. `columns` are SQL column references written in
 * the calling query, never user input: they are interpolated raw.
 */
export function termMatchSql(
  columns: string[],
  searchTerm: string,
  caseSensitive: boolean | null | undefined
): Prisma.Sql {
  const patterns = likePatterns(searchTerm)
  const clauses = columns.flatMap((column) =>
    patterns.map((pattern) =>
      caseSensitive
        ? Prisma.sql`${Prisma.raw(column)} LIKE ${pattern}`
        : Prisma.sql`LOWER(${Prisma.raw(column)}) LIKE LOWER(${pattern})`
    )
  )
  return Prisma.sql`(${Prisma.join(clauses, " OR ")})`
}
