import { DEFAULT_CITATION_SELECT } from "~/services/bank/defaultCitationSelect"
import { FULL_CITATION_SELECT } from "~/services/bank/fullCitationSelect"
import { prisma } from "~/db.server"
import type { BankAuthor, BankPlace, BankTitle } from "@prisma/client"
import type { BankPrimaryKey } from "./bank.types"
import type NullOrUndefined from "~/types/NullOrUndefined"

export async function getFullCitationById(citationId: string) {
  return prisma.bankCitation.findFirst({
    select: FULL_CITATION_SELECT,
    where: { id: parseInt(citationId) },
  })
}

// TODO: Why do we limit this only to the user who entered the currently-viewed
// citation?
// TODO: Can we easily type the return function here...?
export function getCitationsByHeadwordAndUserId(
  headword: NullOrUndefined<string>,
  userId: NullOrUndefined<number>
) {
  // if (!headword)
  //   throw new Error(`getCitationsByHeadwordAndUserId: Headword is null!`)

  return prisma.bankCitation.findMany({
    select: DEFAULT_CITATION_SELECT,
    where: {
      AND: [{ user_id: userId }, { headword: headword ? { headword } : null }],
    },
    take: 100,
  })
}

export function getTitleBySourceId(
  sourceId: string
): Promise<NullOrUndefined<BankTitle>> {
  return prisma.bankTitle.findFirst({
    where: { sources: { some: { id: parseInt(sourceId) } } },
  })
}

export function getPlaceBySourceId(
  sourceId: string
): Promise<NullOrUndefined<BankPlace>> {
  return prisma.bankPlace.findFirst({
    where: { sources: { some: { id: parseInt(sourceId) } } },
  })
}

export function getAuthorBySourceId(
  sourceId: string
): Promise<NullOrUndefined<BankAuthor>> {
  return prisma.bankAuthor.findFirst({
    where: { sources: { some: { id: parseInt(sourceId) } } },
  })
}

export async function findOrCreateHeadword(headword: string) {
  // We are doing this using queryRaw because we MUST have the query be
  // case-sensitive (hence WHERE BINARY).
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

export async function findOrCreateAuthor(author: NullOrUndefined<string>) {
  if (!author) return null

  // We are doing this using queryRaw because we MUST have the query be
  // case-sensitive (hence WHERE BINARY).
  const authorId = await prisma.$queryRaw<
    BankPrimaryKey[]
  >`SELECT id FROM author WHERE BINARY name=${author}`.then((r) => r[0]?.id)
  if (authorId) return authorId

  // Otherwise, insert.
  const result = await prisma.bankAuthor.create({ data: { name: author } })
  return result.id
}

export async function findOrCreatePlace(place: NullOrUndefined<string>) {
  if (!place) return null

  // We are doing this using queryRaw because we MUST have the query be
  // case-sensitive (hence WHERE BINARY).
  const placeId = await prisma.$queryRaw<
    BankPrimaryKey[]
  >`SELECT id FROM place WHERE BINARY name=${place}`.then((r) => r[0]?.id)
  if (placeId) return placeId

  // Otherwise, insert.
  const result = await prisma.bankPlace.create({ data: { name: place } })
  return result.id
}

export async function findOrCreateTitle(title: NullOrUndefined<string>) {
  if (!title) return null

  // We are doing this using queryRaw because we MUST have the query be
  // case-sensitive (hence WHERE BINARY).
  const titleId = await prisma.$queryRaw<
    BankPrimaryKey[]
  >`SELECT id FROM title WHERE BINARY name=${title}`.then((r) => r[0]?.id)
  if (titleId) return titleId

  // Otherwise, insert.
  const result = await prisma.bankTitle.create({ data: { name: title } })
  return result.id
}
