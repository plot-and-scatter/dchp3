import { prisma } from "~/db.server"
import { getUserIdByEmail } from "./user.server"

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

  console.log("==> userId", userId)

  // TODO: Paginate this
  const results = prisma.$queryRaw<
    {
      user_id: number
      last_modified_user_id: number
      text: string
      id: number
      short_meaning: string
      spelling_variant: string
      created: string
      last_modified: string
      headword: string
      source_id: number
      year_published: number
      type_id: number
      year_composed: string
      place_name: string
      email: string
    }[]
  >`SELECT c.user_id, c.last_modified_user_id, c.text, c.id, c.short_meaning, c.spelling_variant, c.created, c.last_modified, h.headword, c.source_id, s.year_published, s.type_id, s.year_composed, p.name as place_name, u.email FROM citation AS c, headword AS h, source AS s, place AS p, user AS u WHERE (c.user_id=${userId} OR c.last_modified_user_id=${userId}) AND c.headword_id=h.id AND c.source_id=s.id AND s.place_id=p.id AND c.user_id=u.id ORDER BY c.created DESC`

  return results
}

export async function getCitationById(citationId: string) {
  const result = prisma.$queryRaw<
    {
      memo: string
      user_id: number
      last_modified_user_id: number
      text: string
      clip_start: number
      clip_end: number
      clipped_text: string
      id: number
      short_meaning: string
      spelling_variant: string
      created: string
      last_modified: string
      part_of_speech: string
      legacy_id: string
      is_incomplete: string
      headword: string
      source_id: number
      year_published: string
      year_composed: string
      type_id: number
      page: string
      email: string
    }[]
  >`SELECT c.memo, c.user_id, c.last_modified_user_id, c.text, c.clip_start, c.clip_end, c.clipped_text, c.id, c.short_meaning, c.spelling_variant, c.created, c.last_modified, c.part_of_speech, c.legacy_id, c.is_incomplete, h.headword, c.source_id, s.year_published, s.year_composed, s.type_id, s.page, u.email FROM citation AS c, headword AS h, source AS s, user AS u WHERE c.id=${citationId} AND c.headword_id=h.id AND c.source_id=s.id AND c.user_id=u.id`

  return result
}
