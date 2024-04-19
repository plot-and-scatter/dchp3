import { prisma } from "~/db.server"
import { DEFAULT_PAGE_SIZE } from "../entry.server"
import type { SearchResultParams } from "../search.server"
import { SEARCH_WILDCARD } from "../search.server"

export interface Quotation {
  id: number
  headword: { headword: string } | null
  text: string | null
}

// case sensitivity not working; check collation
export function getSearchResultQuotations({
  searchTerm,
  skip = 0,
  take = DEFAULT_PAGE_SIZE,
}: SearchResultParams): Promise<Quotation[]> {
  const searchWildcard =
    searchTerm === SEARCH_WILDCARD ? "%" : `%${searchTerm}%`

  return prisma.bankCitation.findMany({
    where: {
      OR: [
        { text: { contains: searchWildcard } },
        { headword: { headword: { contains: searchWildcard } } },
      ],
    },
    skip: skip,
    take: take,
    orderBy: { id: "asc" },
    select: {
      text: true,
      id: true,
      headword: { select: { headword: true } },
    },
  })
}
