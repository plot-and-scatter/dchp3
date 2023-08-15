import { prisma } from "~/db.server"
import { getUserIdByEmail } from "./user.server"
import type { UtteranceType } from "./citation.types.server"
import {
  type AuthorNameType,
  type GetCitationByIdType,
  type GetOwnCitationType,
  type PlaceNameType,
  type TitleNameType,
} from "./citation.types.server"

// export function getBankStats() {
//   return prisma.$queryRaw<{
//     count: number
//   }>`SELECT id, headword FROM det_entries WHERE LOWER(headword) LIKE LOWER(${initialLettersWildcard}) ORDER BY LOWER(headword) ASC LIMIT ${take} OFFSET ${skip}`
// }

export async function getWordCount() {
  const result = prisma.$queryRaw`SELECT description,
sum(LENGTH(text) - LENGTH(REPLACE(text, ' ', '')) + 1)
FROM citation`
}

export async function getOwnCitations(
  email: string,
  skip?: number,
  take: number = 20
) {
  const userId = await getUserIdByEmail({ email })

  // TODO: Paginate this
  const results = prisma.$queryRaw<
    GetOwnCitationType[]
  >`SELECT c.user_id, c.last_modified_user_id, c.text, c.id, c.short_meaning, c.spelling_variant, c.created, c.last_modified, h.headword, c.source_id, s.year_published, s.type_id, s.year_composed, p.name as place_name, u.email FROM citation AS c, headword AS h, source AS s, place AS p, user AS u WHERE (c.user_id=${userId} OR c.last_modified_user_id=${userId}) AND c.headword_id=h.id AND c.source_id=s.id AND s.place_id=p.id AND c.user_id=u.id ORDER BY c.created DESC`

  return results
}

export async function getCitationById(citationId: string) {
  return prisma.$queryRaw<
    GetCitationByIdType[]
  >`SELECT c.memo, c.user_id, c.last_modified_user_id, c.text, c.clip_start, c.clip_end, c.clipped_text, c.id, c.short_meaning, c.spelling_variant, c.created, c.last_modified, c.part_of_speech, c.legacy_id, c.is_incomplete, h.headword, c.source_id, s.year_published, s.year_composed, s.type_id, s.page, u.email FROM citation AS c, headword AS h, source AS s, user AS u WHERE c.id=${citationId} AND c.headword_id=h.id AND c.source_id=s.id AND c.user_id=u.id`.then(
    (response) => response[0] // Get first item
  )
}

export async function getTitleBySourceId(sourceId: string) {
  return prisma.$queryRaw<
    TitleNameType[]
  >`SELECT t.name FROM title AS t, source AS s WHERE s.title_id=t.id AND s.id=${sourceId}`.then(
    (response) => response[0] // Get first item
  )
}

export async function getPlaceBySourceId(sourceId: string) {
  return prisma.$queryRaw<
    PlaceNameType[]
  >`SELECT p.name FROM place AS p, source AS s WHERE s.place_id=p.id AND s.id=${sourceId}`.then(
    (response) => response[0] // Get first item
  )
}

export async function getAuthorBySourceId(sourceId: string) {
  return prisma.$queryRaw<
    AuthorNameType[]
  >`SELECT a.name FROM author AS a, source AS s WHERE s.author_id=a.id AND s.id=${sourceId}`.then(
    (response) => response[0] // Get first item
  )
}

export async function getUtteranceBySourceId(sourceId: string) {
  return prisma.$queryRaw<
    UtteranceType[]
  >`SELECT s.uttered, s.utterance_witness, s.utterance_time, s.utterance_media, s.utterance_broadcast, s.evidence, s.periodical_date, s.dateline, s.volume_issue, s.url, s.url_access_date, s.publisher, s.editor, s.year_composed FROM source s WHERE s.id=${sourceId}`.then(
    (response) => response[0]
  )
}
