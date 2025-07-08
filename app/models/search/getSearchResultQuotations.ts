import { prisma } from "~/db.server"
import { SEARCH_WILDCARD } from "../search.server"
import type { SearchResultParams } from "../search.server"
import { EDITING_STATUS_INPUTS } from "~/components/EntryEditor/EntryEditorSidebar/EditingStatus/EditingStatusPanel"
import { BASE_CANADANISM_TYPES } from "~/types/CanadianismTypeEnum"

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
  editingStatus,
  canadianismType,
}: SearchResultParams) {
  const where: any = {
    meaning: {
      entry: {
        is_public: isUserAdmin ? undefined : true,
        no_cdn_conf: nonCanadianism === true ? true : undefined,
      },
    },
  }

  // If editingStatus is not empty, AND not all statuses are selected, then
  // filter by the selected statuses
  if (
    editingStatus &&
    editingStatus.length &&
    editingStatus.length !== EDITING_STATUS_INPUTS.length
  ) {
    where.meaning.entry.OR = editingStatus.map((status) => ({
      [status]: true,
    }))
  }

  // If canadianismType is not empty, AND not all types are selected, then
  // filter by the selected types
  if (
    canadianismType &&
    canadianismType.length &&
    canadianismType.length !== 0 &&
    canadianismType.length !== BASE_CANADANISM_TYPES.length
  ) {
    where.meaning.canadianism_type = {
      in: canadianismType,
    }
  }

  return where
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
