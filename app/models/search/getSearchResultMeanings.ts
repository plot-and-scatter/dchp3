import { BASE_CANADANISM_TYPES } from "~/types/CanadianismTypeEnum"
import { DEFAULT_PAGE_SIZE } from "../entry.server"
import { prisma } from "~/db.server"
import { SEARCH_WILDCARD } from "../search.server"
import type { SearchResultParams } from "../search.server"

export interface SearchResultMeaning {
  id: number
  definition: string
  entry: { headword: string }
}

// TODO: refactor to use Case Sensitive
export function getSearchResultMeanings({
  searchTerm,
  skip = 0,
  take = DEFAULT_PAGE_SIZE,
  canadianismType = BASE_CANADANISM_TYPES,
  nonCanadianism = false,
}: SearchResultParams): Promise<SearchResultMeaning[]> {
  const where: any = {
    entry: {
      is_public: true,
      no_cdn_conf: nonCanadianism,
    },
    definition: { contains: searchTerm === SEARCH_WILDCARD ? "" : searchTerm },
  }

  if (canadianismType.length !== BASE_CANADANISM_TYPES.length) {
    where.canadianism_type = { in: canadianismType }
  }

  return prisma.meaning.findMany({
    where,
    select: {
      entry: { select: { headword: true } },
      definition: true,
      id: true,
    },
    skip: skip,
    take: take,
  })
}
