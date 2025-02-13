import { Prisma } from "@prisma/client"
import { prisma } from "~/db.server"
import { SEARCH_WILDCARD } from "../search.server"
import type { Entry } from "../entry.server"
import type { SearchResultParams } from "../search.server"
import { DEFAULT_PAGE_SIZE } from "~/utils/pageSize"
import { EDITING_STATUS_INPUTS } from "~/components/EntryEditor/EntryEditorSidebar/EditingStatus/EditingStatusPanel"

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
}: SearchResultParams) {
  const searchWildcard =
    searchTerm === SEARCH_WILDCARD ? "%" : `%${searchTerm}%`

  const { allStatuses, statusMap } = editingStatusHelper(editingStatus)

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
}: SearchResultParams) {
  const searchWildcard =
    searchTerm === SEARCH_WILDCARD ? "%" : `%${searchTerm}%`

  const { allStatuses, statusMap } = editingStatusHelper(editingStatus)

  return prisma.$queryRaw<Pick<Entry, "id" | "headword" | "is_public">[]>`
  SELECT
    id, headword, is_public
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
