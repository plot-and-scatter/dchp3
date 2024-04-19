import { DEFAULT_PAGE_SIZE } from "../entry.server"
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

// case sensitivity not working; check collation
export function getSearchResultQuotations({
  searchTerm,
  skip = 0,
  take = DEFAULT_PAGE_SIZE,
  isUserAdmin = false,
  nonCanadianism,
}: SearchResultParams): Promise<Quotation[]> {
  const searchWildcard =
    searchTerm === SEARCH_WILDCARD ? "%" : `%${searchTerm}%`

  const meaningCondition = {
    meaning: {
      entry: {
        is_public: isUserAdmin ? undefined : true,
        no_cdn_conf: nonCanadianism === true ? true : undefined,
      },
    },
  }

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
    where: {
      AND: [
        { meanings: { some: meaningCondition } },
        {
          OR: [
            { citation: { contains: searchWildcard } },
            { headword: { contains: searchWildcard } },
          ],
        },
      ],
    },
    select: {
      meanings: {
        where: meaningCondition,
        select: meaningSelect,
      },
      citation: true,
      id: true,
      headword: true,
    },
    skip: skip,
    take: take,
    orderBy: { headword: "asc" },
  })
}
