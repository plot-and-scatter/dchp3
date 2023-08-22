import { prisma } from "~/db.server"
import type {
  BankPrimaryKey,
  BankCitationsByHeadwordAndUserId,
  BankSource,
  BankCitationUpdate,
  BankSourceUpdate,
  BankCitationCreate,
  BankSourceCreate,
} from "./bank.types"
import {
  type BankAuthorName,
  type BankCitationById,
  type BankPlaceName,
  type BankTitleName,
} from "./bank.types"

// export function getBankStats() {
//   return prisma.$queryRaw<{
//     count: number
//   }>`SELECT id, headword FROM det_entries WHERE LOWER(headword) LIKE LOWER(${initialLettersWildcard}) ORDER BY LOWER(headword) ASC LIMIT ${take} OFFSET ${skip}`
// }

export async function getWordCount() {
  const result = prisma.$queryRaw`SELECT description,
sum(LENGTH(text) - LENGTH(REPLACE(text, ' ', '')) + 1)
FROM citation`

  return result
}

export async function getCitationById(citationId: string) {
  return prisma.$queryRaw<
    BankCitationById[]
  >`SELECT c.memo, c.user_id, c.last_modified_user_id, c.text, c.clip_start, c.clip_end, c.clipped_text, c.id, c.short_meaning, c.spelling_variant, c.created, c.last_modified, c.part_of_speech, c.legacy_id, c.is_incomplete, h.headword, c.source_id, s.year_published, s.year_composed, s.type_id, s.page, u.email FROM citation AS c, headword AS h, source AS s, user AS u WHERE c.id=${citationId} AND c.headword_id=h.id AND c.source_id=s.id AND c.user_id=u.id`.then(
    (response) => response[0] // Get first item
  )
}

// TODO: Why do we limit this only to the user who entered the currently-viewed citation?
export async function getCitationsByHeadwordAndUserId(
  headword: string,
  userId: number
) {
  return prisma.$queryRaw<
    BankCitationsByHeadwordAndUserId[]
  >`SELECT c.id, c.headword_id, h.headword, p.name, s.year_published, u.email FROM citation AS c, headword AS h, source AS s, place AS p, user AS u WHERE c.user_id=${userId} AND h.id=c.headword_id AND c.source_id=s.id AND s.place_id=p.id AND u.id=${userId} AND h.headword=${headword} ORDER BY c.headword_id, c.id ASC`
}

export async function getTitleBySourceId(sourceId: string) {
  return prisma.$queryRaw<
    BankTitleName[]
  >`SELECT t.name FROM title AS t, source AS s WHERE s.title_id=t.id AND s.id=${sourceId}`.then(
    (response) => response[0] // Get first item
  )
}

export async function getPlaceBySourceId(sourceId: string) {
  return prisma.$queryRaw<
    BankPlaceName[]
  >`SELECT p.name FROM place AS p, source AS s WHERE s.place_id=p.id AND s.id=${sourceId}`.then(
    (response) => response[0] // Get first item
  )
}

export async function getAuthorBySourceId(sourceId: string) {
  return prisma.$queryRaw<
    BankAuthorName[]
  >`SELECT a.name FROM author AS a, source AS s WHERE s.author_id=a.id AND s.id=${sourceId}`.then(
    (response) => response[0] // Get first item
  )
}

export async function getUtteranceBySourceId(sourceId: string) {
  return prisma.$queryRaw<
    BankSource[]
  >`SELECT s.uttered, s.utterance_witness, s.utterance_time, s.utterance_media, s.utterance_broadcast, s.evidence, s.periodical_date, s.dateline, s.volume_issue, s.url, s.url_access_date, s.publisher, s.editor, s.year_composed FROM source s WHERE s.id=${sourceId}`.then(
    (response) => response[0]
  )
}

export async function findOrCreateHeadword(headword: string) {
  const headwordId = await prisma.$queryRaw<
    BankPrimaryKey[]
  >`SELECT id FROM headword WHERE BINARY headword=${headword}`.then(
    (r) => r[0]?.id
  )
  if (headwordId) return headwordId

  // Otherwise, insert.
  const result = await prisma.bankHeadword.create({ data: { headword } })
  return result.id
}

export async function findOrCreateAuthor(author: string) {
  const authorId = await prisma.$queryRaw<
    BankPrimaryKey[]
  >`SELECT id FROM author WHERE BINARY name=${author}`.then((r) => r[0]?.id)
  if (authorId) return authorId

  // Otherwise, insert.
  const result = await prisma.bankAuthor.create({ data: { name: author } })
  return result.id
}

export async function findOrCreatePlace(place: string) {
  const placeId = await prisma.$queryRaw<
    BankPrimaryKey[]
  >`SELECT id FROM place WHERE BINARY name=${place}`.then((r) => r[0]?.id)
  if (placeId) return placeId

  // Otherwise, insert.
  const result = await prisma.bankPlace.create({ data: { name: place } })
  return result.id
}

export async function findOrCreateTitle(title: string) {
  const titleId = await prisma.$queryRaw<
    BankPrimaryKey[]
  >`SELECT id FROM title WHERE BINARY name=${title}`.then((r) => r[0]?.id)
  if (titleId) return titleId

  // Otherwise, insert.
  const result = await prisma.bankTitle.create({ data: { name: title } })
  return result.id
}

export async function updateCitation(citationFields: BankCitationUpdate) {
  await prisma.bankCitation.update({
    where: { id: citationFields.id },
    data: citationFields,
  })
}

export async function updateSource(sourceFields: BankSourceUpdate) {
  await prisma.bankSource.update({
    where: { id: sourceFields.id },
    data: sourceFields,
  })
}

export async function createCitation(citationFields: BankCitationCreate) {
  return await prisma.bankCitation.create({ data: citationFields })
}

export async function createSource(sourceFields: BankSourceCreate) {
  return await prisma.bankSource.create({ data: sourceFields })
}
