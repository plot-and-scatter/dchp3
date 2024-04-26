import { BASE_CANADANISM_TYPES } from "~/types/CanadianismTypeEnum"
import { prisma } from "~/db.server"
import { SEARCH_WILDCARD } from "../search.server"
import type { SearchResultParams } from "../search.server"

export interface SearchResultMeaning {
  id: number
  definition: string
  entry: { headword: string }
}

function getWhereClause({
  nonCanadianism,
  searchTerm,
  canadianismType,
}: SearchResultParams) {
  const where: any = {
    entry: {
      is_public: true,
      no_cdn_conf: nonCanadianism,
    },
    definition: {
      contains: searchTerm === SEARCH_WILDCARD ? "" : searchTerm,
    },
  }

  if (canadianismType.length !== BASE_CANADANISM_TYPES.length) {
    where.canadianism_type = { in: canadianismType }
  }

  return where
}

export function getMeaningsCount(params: SearchResultParams) {
  return prisma.meaning.count({
    where: getWhereClause(params),
  })
}

// TODO: refactor to use Case Sensitive
export function getSearchResultMeanings(
  params: SearchResultParams
): Promise<SearchResultMeaning[]> {
  return prisma.meaning.findMany({
    where: getWhereClause(params),
    select: {
      entry: { select: { headword: true } },
      definition: true,
      id: true,
    },
    skip: params.skip,
    take: params.take,
  })
}
