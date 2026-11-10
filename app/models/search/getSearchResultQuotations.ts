import { prisma } from "~/db.server"
import { categoryWhere } from "./entryCategory"
import type { SearchResultParams } from "../search.server"
import { likePatterns } from "./quoteVariants"
import { EDITING_STATUS_INPUTS } from "~/components/EntryEditor/EntryEditorSidebar/EditingStatus/EditingStatusPanel"

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
  canadianismTypes,
  versions,
}: SearchResultParams) {
  const where: any = {
    meaning: {
      entry: {
        is_public: isUserAdmin ? undefined : true,
        dchp_version: { in: versions },
      },
      ...categoryWhere({ nonCanadianism, canadianismTypes }),
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

  return where
}

function getWhereClause(params: SearchResultParams) {
  const patterns = likePatterns(params.searchTerm)

  const where: any = {
    AND: [
      { meanings: { some: getMeaningCondition(params) } },
      {
        OR: patterns.flatMap((pattern) => [
          { citation: { contains: pattern } },
          { headword: { contains: pattern } },
        ]),
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
