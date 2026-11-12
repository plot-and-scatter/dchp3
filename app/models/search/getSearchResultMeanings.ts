import { prisma } from "~/db.server"
import { categoryWhere } from "./entryCategory"
import { SEARCH_WILDCARD } from "../search.server"
import type { SearchResultParams } from "../search.server"
import { quoteVariants } from "./quoteVariants"
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
  ignoreCategories,
  editingStatus,
  versions,
  isUserAdmin,
}: SearchResultParams) {
  // One quote spelling keeps the plain `definition: { contains }` shape; more
  // than one becomes an OR under AND, because categoryWhere owns the top-level
  // OR.
  const variants =
    searchTerm === SEARCH_WILDCARD ? [""] : quoteVariants(searchTerm)
  const definitionWhere =
    variants.length === 1
      ? { definition: { contains: variants[0] } }
      : {
          AND: [
            {
              OR: variants.map((variant) => ({
                definition: { contains: variant },
              })),
            },
          ],
        }

  const where: any = {
    entry: {
      dchp_version: { in: versions },
    },
    ...definitionWhere,
    ...categoryWhere({ nonCanadianism, canadianismTypes, ignoreCategories }),
  }

  // Handle is_public OR isUserAdmin logic
  if (!isUserAdmin) {
    where.entry.is_public = true
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
