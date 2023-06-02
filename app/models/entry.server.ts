import type { Entry } from "@prisma/client"
import { prisma } from "~/db.server"
import { isNonPositive } from "~/utils/numberUtils"

export type { Entry } from "@prisma/client"

const DEFAULT_PAGE_SIZE = 100

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
    take,
  })
}

export function getEntriesByInitialLettersAndPage(
  initialLetters: string,
  page: string
) {
  const pageNumber = parseInt(page)
  if (isNaN(pageNumber)) {
    throw new Error(`Page Number ("${page}") must be a number`)
  } else if (isNonPositive(pageNumber)) {
    throw new Error(`Page Number ("${page}") must be greater than zero`)
  }

  const skip: number = (pageNumber - 1) * DEFAULT_PAGE_SIZE
  return getEntriesByInitialLetters(initialLetters, skip)
}

export async function putEntries(data: any) {
  // the rest of the fields can go here and be added later
  const idValue = parseInt(data.id)
  const headword = data.headword

  // temporary; we'll need to add error checking etc.
  // this is just to protect our local dev test databases for now
  const id = idValue ? idValue : Number.MAX_SAFE_INTEGER

  await prisma.entry.create({
    data: {
      id: id,
      headword: headword,
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
      edit_status_comment: "this word is for testing",
    },
  })
}

export function getEntriesByInitialLetters(
  initialLetters: string,
  skip: number = 0,
  take: number = DEFAULT_PAGE_SIZE
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
  take: number = 100,
  caseSensitive: boolean = false
) {
  if (text.length === 0) {
    throw new Error(`Text ("${text}") length must be greater than zero`)
  }
  const searchWildcard = `%${text}%`

  return prisma.$queryRaw<
    Pick<Entry, "id" | "headword">[]
  >`SELECT id, headword FROM det_entries 
    WHERE IF(${caseSensitive}, 
      (headword) LIKE (${searchWildcard}), 
      LOWER(headword) LIKE LOWER(${searchWildcard}))  
    ORDER BY headword ASC LIMIT ${take} OFFSET ${skip}`
}
