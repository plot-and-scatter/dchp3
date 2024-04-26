import { Prisma } from "@prisma/client"
import { prisma } from "~/db.server"
import { SEARCH_WILDCARD } from "../search.server"
import type { SearchResultParams } from "../search.server"
import { DEFAULT_PAGE_SIZE } from "~/utils/pageSize"

export interface FistNote {
  headword: string
  fistNote: string
  id: number
}

export function getFistNotesCount({
  searchTerm,
  skip = 0,
  take = DEFAULT_PAGE_SIZE,
  caseSensitive = false,
  database,
  isUserAdmin = false,
  nonCanadianism,
}: SearchResultParams) {
  const searchWildcard =
    searchTerm === SEARCH_WILDCARD ? "%" : `%${searchTerm}%`

  // TODO: Change this
  return prisma.$queryRaw<{ count: number }[]>`
    SELECT
      count(*) as count
    FROM det_entries
    WHERE
      IF(${caseSensitive},
        (fist_note) LIKE (${searchWildcard}),
        LOWER(fist_note) LIKE LOWER(${searchWildcard}))
      AND (det_entries.dchp_version IN (${Prisma.join(database)}))
      AND (det_entries.is_public = 1 OR ${isUserAdmin})
      AND (det_entries.no_cdn_conf = 1 OR NOT ${nonCanadianism === true})`
}

// case sensitivity not working; check collation
export function getSearchResultFistNotes({
  searchTerm,
  skip = 0,
  take = DEFAULT_PAGE_SIZE,
  caseSensitive = false,
  database,
  isUserAdmin = false,
  nonCanadianism,
}: SearchResultParams): Promise<FistNote[]> {
  const searchWildcard =
    searchTerm === SEARCH_WILDCARD ? "%" : `%${searchTerm}%`

  // TODO: Change this
  return prisma.$queryRaw<FistNote[]>`
  SELECT
    headword,
    fist_note,
    id
  FROM det_entries
  WHERE
    IF(${caseSensitive},
      (fist_note) LIKE (${searchWildcard}),
      LOWER(fist_note) LIKE LOWER(${searchWildcard}))
    AND (det_entries.dchp_version IN (${Prisma.join(database)}))
    AND (det_entries.is_public = 1 OR ${isUserAdmin})
    AND (det_entries.no_cdn_conf = 1 OR NOT ${nonCanadianism === true})
  ORDER BY LOWER(headword) ASC LIMIT ${take} OFFSET ${skip}`
}
