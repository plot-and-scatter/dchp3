import { Prisma } from "@prisma/client"
import { prisma } from "~/db.server"
import { SEARCH_WILDCARD } from "../search.server"
import type { SearchResultParams } from "../search.server"
import { DEFAULT_PAGE_SIZE } from "~/utils/pageSize"
import { editingStatusHelper } from "./getEntriesByBasicTextSearch"
import { BASE_CANADANISM_TYPES } from "~/types/CanadianismTypeEnum"

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
  canadianismType, // add default
  editingStatus,
}: SearchResultParams) {
  const searchWildcard =
    searchTerm === SEARCH_WILDCARD ? "%" : `%${searchTerm}%`

  // If canadianismType is not provided, use the default BASE_CANADANISM_TYPES
  if (!canadianismType || canadianismType.length === 0) {
    canadianismType = [...BASE_CANADANISM_TYPES]
  }

  const { allStatuses, statusMap } = editingStatusHelper(editingStatus)

  return prisma.$queryRaw<{ count: number }[]>`
  SELECT
    count(*) as count
  FROM det_meanings, det_entries de
  WHERE
    det_meanings.entry_id = de.id
    AND IF(${caseSensitive},
      (det_meanings.canadianism_type_comment) LIKE (${searchWildcard}),
      LOWER(det_meanings.canadianism_type_comment) LIKE LOWER(${searchWildcard})
    )
    AND (de.dchp_version IN (${Prisma.join(database)}))
    AND (de.is_public = 1 OR ${isUserAdmin})
    AND (de.no_cdn_conf = 1 OR NOT ${nonCanadianism === true})
    AND (det_meanings.canadianism_type IN (${Prisma.join(canadianismType)}))
    AND (${allStatuses} OR (
      (de.first_draft = 1 AND ${statusMap["first_draft"] === true}) OR
      (de.revised_draft = 1 AND ${statusMap["revised_draft"] === true}) OR
      (de.semantically_revised = 1 AND ${
        statusMap["semantically_revised"] === true
      }) OR
      (de.edited_for_style = 1 AND ${statusMap["edited_for_style"] === true}) OR
      (de.proofread = 1 AND ${statusMap["proofread"] === true}) OR
      (de.chief_editor_ok = 1 AND ${statusMap["chief_editor_ok"] === true}) OR
      (de.final_proofing = 1 AND ${statusMap["final_proofing"] === true}) OR
      (de.no_cdn_susp = 1 AND ${statusMap["no_cdn_susp"] === true}) OR
      (de.no_cdn_conf = 1 AND ${statusMap["no_cdn_conf"] === true})
    ))`
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
  editingStatus,
  canadianismType, // add default
}: SearchResultParams): Promise<Canadianism[]> {
  // If canadianismType is not provided, use the default BASE_CANADANISM_TYPES
  if (!canadianismType || canadianismType.length === 0) {
    canadianismType = [...BASE_CANADANISM_TYPES]
  }

  const searchWildcard =
    searchTerm === SEARCH_WILDCARD ? "%" : `%${searchTerm}%`

  const { allStatuses, statusMap } = editingStatusHelper(editingStatus)

  return prisma.$queryRaw<Canadianism[]>`
  SELECT
    de.headword as headword,
    det_meanings.canadianism_type_comment,
    det_meanings.id
  FROM det_meanings, det_entries de
  WHERE
    det_meanings.entry_id = de.id
    AND IF(${caseSensitive},
      (det_meanings.canadianism_type_comment) LIKE (${searchWildcard}),
      LOWER(det_meanings.canadianism_type_comment) LIKE LOWER(${searchWildcard})
    )
    AND (de.dchp_version IN (${Prisma.join(database)}))
    AND (de.is_public = 1 OR ${isUserAdmin})
    AND (de.no_cdn_conf = 1 OR NOT ${nonCanadianism === true})
    AND (det_meanings.canadianism_type IN (${Prisma.join(canadianismType)}))
    AND (${allStatuses} OR (
      (de.first_draft = 1 AND ${statusMap["first_draft"] === true}) OR
      (de.revised_draft = 1 AND ${statusMap["revised_draft"] === true}) OR
      (de.semantically_revised = 1 AND ${
        statusMap["semantically_revised"] === true
      }) OR
      (de.edited_for_style = 1 AND ${statusMap["edited_for_style"] === true}) OR
      (de.proofread = 1 AND ${statusMap["proofread"] === true}) OR
      (de.chief_editor_ok = 1 AND ${statusMap["chief_editor_ok"] === true}) OR
      (de.final_proofing = 1 AND ${statusMap["final_proofing"] === true}) OR
      (de.no_cdn_susp = 1 AND ${statusMap["no_cdn_susp"] === true}) OR
      (de.no_cdn_conf = 1 AND ${statusMap["no_cdn_conf"] === true})
    ))
  ORDER BY LOWER(de.headword) ASC LIMIT ${take} OFFSET ${skip}`
}
