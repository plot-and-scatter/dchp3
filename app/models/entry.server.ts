import type { Entry } from "@prisma/client"

import { prisma } from "~/db.server"

export type { Entry } from "@prisma/client"

export function getEntryById({ id }: Pick<Entry, "id">) {
  return prisma.entry.findUnique({
    where: { id },
    include: {
      meanings: true,
    },
  })
}

export function getEntryByHeadword({ headword }: Pick<Entry, "headword">) {
  return prisma.entry.findFirst({
    where: { headword },
    include: {
      meanings: {
        include: {
          usageNotes: true,
          seeAlso: {
            include: {
              entry: {
                select: {
                  headword: true,
                },
              },
            },
          },
          citations: {
            include: {
              citation: true,
            },
          },
        },
      },
    },
  })
}

export function getEntries(skip?: number, take: number = 20) {
  const _skip = skip || Math.floor(Math.random() * 2000)
  return prisma.entry.findMany({
    select: { id: true, headword: true },
    orderBy: { headword: "asc" },
    skip: _skip,
    take: 40,
  })
}

export async function putEntries(data: any) {
  await prisma.entry.create({
    data: {
      id: parseInt(data.id), // TODO this is not a good idea
      headword: data.headword,
      first_field: "first field",
      etymology: "etymology",
      is_legacy: false,
      is_public: true,
      spelling_variants: null,
      superscript: "Superscript",
      dagger: false,
      general_labels: null,
      proofing_status: 1,
      proofing_user: null,
      fist_note: null,
      image_file_name: null,
      comment: null,
      first_draft: false,
      revised_draft: true,
      semantically_revised: false,
      edited_for_style: false,
      proofread: false,
      chief_editor_ok: false,
      final_proofing: false,
      no_cdn_susp: false,
      no_cdn_conf: false,
      edit_status_comment: "this word is for testing"
    },
  });
}

export function getEntriesByInitialLetters(
  initialLetters: string,
  skip: number = 0,
  take: number = 100
) {
  if (initialLetters.length === 0) {
    throw new Error(
      `Initial letters ("${initialLetters}") length must be greater than zero`
    )
  }
  const initialLettersWildcard = `${initialLetters}%`
  return prisma.$queryRaw<
    Pick<Entry, "id" | "headword">[]
  >`SELECT id, headword FROM det_entries WHERE LOWER(headword) LIKE LOWER(${initialLettersWildcard}) ORDER BY LOWER(headword) ASC LIMIT ${take} OFFSET ${skip}`
}

export function getEntriesByBasicTextSearch(
  text: string,
  skip: number = 0,
  take: number = 100
) {
  if (text.length === 0) {
    throw new Error(`Text ("${text}") length must be greater than zero`)
  }
  const searchWildcard = `%${text}%`
  return prisma.$queryRaw<
    Pick<Entry, "id" | "headword">[]
  >`SELECT id, headword FROM det_entries WHERE LOWER(headword) LIKE LOWER(${searchWildcard}) ORDER BY headword ASC LIMIT ${take} OFFSET ${skip}`
}
