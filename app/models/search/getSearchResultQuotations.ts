import { prisma } from "~/db.server"
import { SEARCH_WILDCARD } from "../search.server"
import type { SearchResultParams } from "../search.server"

export interface Quotation {
  id: number
  citation: string | null
  headword: string | null
  meanings: {
    meaning: {
      entry: {
        headword: string
        is_public: boolean
        no_cdn_conf: boolean
      }
    } | null
  }[]
}

function getMeaningCondition({
  isUserAdmin,
  nonCanadianism,
}: SearchResultParams) {
  return {
    meaning: {
      entry: {
        is_public: isUserAdmin ? undefined : true,
        no_cdn_conf: nonCanadianism === true ? true : undefined,
      },
    },
  }
}

function getWhereClause(params: SearchResultParams) {
  const searchWildcard =
    params.searchTerm === SEARCH_WILDCARD ? "%" : `%${params.searchTerm}%`

  const where: any = {
    AND: [
      { meanings: { some: getMeaningCondition(params) } },
      {
        OR: [
          { citation: { contains: searchWildcard } },
          { headword: { contains: searchWildcard } },
        ],
      },
    ],
  }

  return where
}

export function getQuotationsCount(params: SearchResultParams) {
  return prisma.detCitation.count({
    where: getWhereClause(params),
  })
}

// case sensitivity not working; check collation
export function getSearchResultQuotations(params: SearchResultParams) {
  const meaningSelect = {
    meaning: {
      select: {
        entry: {
          select: {
            headword: true,
            is_public: true,
            no_cdn_conf: true,
          },
        },
      },
    },
  }

  return prisma.detCitation.findMany({
    where: getWhereClause(params),
    select: {
      meanings: {
        where: getMeaningCondition(params),
        select: meaningSelect,
      },
      citation: true,
      id: true,
      headword: true,
    },
    skip: params.skip,
    take: params.take,
    orderBy: { headword: "asc" },
  })
}
