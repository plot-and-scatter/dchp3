import { Prisma } from "@prisma/client"
import { prisma } from "~/db.server"
import { SEARCH_WILDCARD } from "../search.server"
import type { Entry } from "../entry.server"
import type { SearchResultParams } from "../search.server"
import { DEFAULT_PAGE_SIZE } from "~/utils/pageSize"

export function getHeadwordCount({
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

  return prisma.$queryRaw<{ count: number }[]>`
  SELECT
    count(*) as count
  FROM det_entries
  WHERE
    IF (${caseSensitive},
      (headword) LIKE (${searchWildcard} OR spelling_variants LIKE (${searchWildcard})),
      (LOWER(headword) LIKE LOWER(${searchWildcard}) OR LOWER(spelling_variants) LIKE LOWER(${searchWildcard}))
    )
    AND (det_entries.dchp_version IN (${Prisma.join(database)}))
    AND (det_entries.is_public = 1 OR ${isUserAdmin})
    AND (det_entries.no_cdn_conf = 1 OR NOT ${nonCanadianism === true})
  `
}

export function getEntriesByBasicTextSearch({
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

  return prisma.$queryRaw<Pick<Entry, "id" | "headword" | "is_public">[]>`
  SELECT
    id, headword, is_public
  FROM det_entries
  WHERE
    IF (${caseSensitive},
      (headword) LIKE (${searchWildcard} OR spelling_variants LIKE (${searchWildcard})),
      (LOWER(headword) LIKE LOWER(${searchWildcard}) OR LOWER(spelling_variants) LIKE LOWER(${searchWildcard}))
    )
    AND (det_entries.dchp_version IN (${Prisma.join(database)}))
    AND (det_entries.is_public = 1 OR ${isUserAdmin})
    AND (det_entries.no_cdn_conf = 1 OR NOT ${nonCanadianism === true})
  ORDER BY LOWER(headword) ASC LIMIT ${take} OFFSET ${skip}
  `
}
