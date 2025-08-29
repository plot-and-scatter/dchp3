import { Prisma } from "@prisma/client"
import { prisma } from "~/db.server"
import { SEARCH_WILDCARD } from "../search.server"
import type { Entry } from "../entry.server"
import type { SearchResultParams } from "../search.server"
import { DEFAULT_PAGE_SIZE } from "~/utils/pageSize"
import { EDITING_STATUS_INPUTS } from "~/components/EntryEditor/EntryEditorSidebar/EditingStatus/EditingStatusPanel"
import { BASE_CANADANISM_TYPES } from "~/types/CanadianismTypeEnum"

export const editingStatusHelper = (editingStatus: string[] | undefined) => {
  const allStatuses =
    editingStatus?.length === 0 ||
    editingStatus === undefined ||
    editingStatus?.length === EDITING_STATUS_INPUTS.length

  const statusMap: Record<string, boolean> = {}
  editingStatus?.forEach((status) => (statusMap[status] = true))

  return { allStatuses, statusMap }
}

export function getHeadwordCount({
  searchTerm,
  skip = 0,
  take = DEFAULT_PAGE_SIZE,
  caseSensitive = false,
  database,
  isUserAdmin = false,
  nonCanadianism,
  editingStatus,
  canadianismTypes,
}: SearchResultParams) {
  const searchWildcard =
    searchTerm === SEARCH_WILDCARD ? "%" : `%${searchTerm}%`

  const { allStatuses, statusMap } = editingStatusHelper(editingStatus)

  // Check if we need to filter by canadianism types
  const needsCanadianismFilter = canadianismTypes && canadianismTypes.length !== BASE_CANADANISM_TYPES.length

  if (needsCanadianismFilter) {
    return prisma.$queryRaw<{ count: number }[]>`
    SELECT
      count(DISTINCT de.id) as count
    FROM det_entries de
    INNER JOIN det_meanings dm ON de.id = dm.entry_id
    WHERE
      IF (${caseSensitive},
        (de.headword) LIKE (${searchWildcard}) OR de.spelling_variants LIKE (${searchWildcard}),
        (LOWER(de.headword) LIKE LOWER(${searchWildcard})) OR LOWER(de.spelling_variants) LIKE LOWER(${searchWildcard})
      )
      AND (de.dchp_version IN (${Prisma.join(database)}))
      AND (de.is_public = 1 OR ${isUserAdmin})
      AND (de.no_cdn_conf = 1 OR NOT ${nonCanadianism === true})
      AND (dm.canadianism_type IN (${Prisma.join(canadianismTypes)}))
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
    `
  }

  return prisma.$queryRaw<{ count: number }[]>`
  SELECT
    count(*) as count
  FROM det_entries de
  WHERE
    IF (${caseSensitive},
      (headword) LIKE (${searchWildcard} OR spelling_variants LIKE (${searchWildcard})),
      (LOWER(headword) LIKE LOWER(${searchWildcard}) OR LOWER(spelling_variants) LIKE LOWER(${searchWildcard}))
    )
    AND (de.dchp_version IN (${Prisma.join(database)}))
    AND (de.is_public = 1 OR ${isUserAdmin})
    AND (de.no_cdn_conf = 1 OR NOT ${nonCanadianism === true})
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
  editingStatus,
  canadianismTypes,
}: SearchResultParams) {
  const searchWildcard =
    searchTerm === SEARCH_WILDCARD ? "%" : `%${searchTerm}%`

  const { allStatuses, statusMap } = editingStatusHelper(editingStatus)

  // Check if we need to filter by canadianism types
  const needsCanadianismFilter = canadianismTypes && canadianismTypes.length !== BASE_CANADANISM_TYPES.length

  if (needsCanadianismFilter) {
    return prisma.$queryRaw<
      Pick<Entry, "id" | "headword" | "dchp_version" | "is_public">[]
    >`
    SELECT DISTINCT
      de.id, de.headword, de.is_public, de.dchp_version
    FROM det_entries de
    INNER JOIN det_meanings dm ON de.id = dm.entry_id
    WHERE
      IF (${caseSensitive},
        (de.headword) LIKE (${searchWildcard}) OR de.spelling_variants LIKE (${searchWildcard}),
        (LOWER(de.headword) LIKE LOWER(${searchWildcard})) OR LOWER(de.spelling_variants) LIKE LOWER(${searchWildcard})
      )
      AND (de.dchp_version IN (${Prisma.join(database)}))
      AND (de.is_public = 1 OR ${isUserAdmin})
      AND (de.no_cdn_conf = 1 OR NOT ${nonCanadianism === true})
      AND (dm.canadianism_type IN (${Prisma.join(canadianismTypes)}))
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
    ORDER BY LOWER(de.headword) ASC LIMIT ${take} OFFSET ${skip}
    `
  }

  return prisma.$queryRaw<
    Pick<Entry, "id" | "headword" | "dchp_version" | "is_public">[]
  >`
  SELECT
    id, headword, is_public, dchp_version
  FROM det_entries de
  WHERE
    IF (${caseSensitive},
      (headword) LIKE (${searchWildcard} OR spelling_variants LIKE (${searchWildcard})),
      (LOWER(headword) LIKE LOWER(${searchWildcard}) OR LOWER(spelling_variants) LIKE LOWER(${searchWildcard}))
    )
    AND (de.dchp_version IN (${Prisma.join(database)}))
    AND (de.is_public = 1 OR ${isUserAdmin})
    AND (de.no_cdn_conf = 1 OR NOT ${nonCanadianism === true})
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
  ORDER BY LOWER(headword) ASC LIMIT ${take} OFFSET ${skip}
  `
}
