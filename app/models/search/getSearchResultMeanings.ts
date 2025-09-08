import { BASE_CANADANISM_TYPES } from "~/types/CanadianismTypeEnum"
import { prisma } from "~/db.server"
import { SEARCH_WILDCARD } from "../search.server"
import type { SearchResultParams } from "../search.server"
import { EDITING_STATUS_INPUTS } from "~/components/EntryEditor/EntryEditorSidebar/EditingStatus/EditingStatusPanel"

export interface SearchResultMeaning {
  id: number
  definition: string
  entry: { headword: string }
}

function getWhereClause({
  nonCanadianism,
  searchTerm,
  canadianismTypes,
  editingStatus,
  versions,
  isUserAdmin,
}: SearchResultParams) {
  const where: any = {
    entry: {
      no_cdn_conf: nonCanadianism,
      dchp_version: { in: versions },
    },
    definition: {
      contains: searchTerm === SEARCH_WILDCARD ? "" : searchTerm,
    },
  }
  
  // Handle is_public OR isUserAdmin logic
  if (!isUserAdmin) {
    where.entry.is_public = true
  }

  if (canadianismTypes.length !== BASE_CANADANISM_TYPES.length) {
    where.canadianism_type = { in: canadianismTypes }
  }

  // If editingStatus is not empty, AND not all statuses are selected, then
  // filter by the selected statuses
  if (
    editingStatus &&
    editingStatus.length &&
    editingStatus.length !== EDITING_STATUS_INPUTS.length
  ) {
    where.entry.OR = editingStatus.map((status) => ({
      [status]: true,
    }))
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
