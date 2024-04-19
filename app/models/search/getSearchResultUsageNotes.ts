import { DEFAULT_PAGE_SIZE } from "../entry.server"
import { Prisma } from "@prisma/client"
import { prisma } from "~/db.server"
import { SEARCH_WILDCARD } from "../search.server"
import type { SearchResultParams } from "../search.server"

export interface UsageNote {
  headword: string
  partOfSpeech: string
  usage: string
  id: number
}

// case sensitivity not working; check collation
export function getSearchResultUsageNotes({
  searchTerm,
  skip = 0,
  take = DEFAULT_PAGE_SIZE,
  caseSensitive = false,
  database,
  isUserAdmin = false,
  nonCanadianism = false,
}: SearchResultParams): Promise<UsageNote[]> {
  const searchWildcard =
    searchTerm === SEARCH_WILDCARD ? "%" : `%${searchTerm}%`

  return prisma.$queryRaw<UsageNote[]>`
  SELECT
    det_entries.headword as headword,
    det_meanings.usage,
    det_meanings.partofspeech,
    det_meanings.id
  FROM det_meanings, det_entries
  WHERE
    det_meanings.entry_id = det_entries.id
    AND IF(${caseSensitive},
      (det_meanings.usage) LIKE (${searchWildcard}),
      LOWER(det_meanings.usage) LIKE LOWER(${searchWildcard})
    )
    AND (det_entries.dchp_version IN (${Prisma.join(database)}))
    AND (det_entries.is_public = 1 OR ${isUserAdmin})
    AND (det_entries.no_cdn_conf = 1 OR NOT ${nonCanadianism === true})
  ORDER BY LOWER(det_entries.headword) ASC LIMIT ${take} OFFSET ${skip}`
}
