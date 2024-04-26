import { Prisma } from "@prisma/client"
import { prisma } from "~/db.server"
import { SEARCH_WILDCARD } from "../search.server"
import type { SearchResultParams } from "../search.server"
import { DEFAULT_PAGE_SIZE } from "~/utils/pageSize"

export interface Canadianism {
  headword: string
  canadianismDescription: string
  id: number
}

export function getCanadianismsCount({
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
  FROM det_meanings, det_entries
  WHERE
    det_meanings.entry_id = det_entries.id
    AND IF(${caseSensitive},
      (det_meanings.canadianism_type_comment) LIKE (${searchWildcard}),
      LOWER(det_meanings.canadianism_type_comment) LIKE LOWER(${searchWildcard})
    )
    AND (det_entries.dchp_version IN (${Prisma.join(database)}))
    AND (det_entries.is_public = 1 OR ${isUserAdmin})
    AND (det_entries.no_cdn_conf = 1 OR NOT ${nonCanadianism === true})`
}

// case sensitivity not working; check collation
export function getSearchResultCanadianisms({
  searchTerm,
  skip = 0,
  take = DEFAULT_PAGE_SIZE,
  caseSensitive = false,
  database,
  isUserAdmin = false,
  nonCanadianism,
}: SearchResultParams): Promise<Canadianism[]> {
  const searchWildcard =
    searchTerm === SEARCH_WILDCARD ? "%" : `%${searchTerm}%`

  return prisma.$queryRaw<Canadianism[]>`
  SELECT
    det_entries.headword as headword,
    det_meanings.canadianism_type_comment,
    det_meanings.id
  FROM det_meanings, det_entries
  WHERE
    det_meanings.entry_id = det_entries.id
    AND IF(${caseSensitive},
      (det_meanings.canadianism_type_comment) LIKE (${searchWildcard}),
      LOWER(det_meanings.canadianism_type_comment) LIKE LOWER(${searchWildcard})
    )
    AND (det_entries.dchp_version IN (${Prisma.join(database)}))
    AND (det_entries.is_public = 1 OR ${isUserAdmin})
    AND (det_entries.no_cdn_conf = 1 OR NOT ${nonCanadianism === true})
  ORDER BY LOWER(det_entries.headword) ASC LIMIT ${take} OFFSET ${skip}`
}
