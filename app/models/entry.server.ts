import type { Entry } from "@prisma/client"
import invariant from "tiny-invariant"
import { prisma } from "~/db.server"
import {
  getEmailFromSession,
  getUserIdAndEmail,
} from "~/services/auth/session.server"
import {
  getCheckboxValueAsBoolean,
  getStringFromFormInput,
} from "~/utils/generalUtils"
import { isNonPositive } from "~/utils/numberUtils"
import { DEFAULT_PAGE_SIZE } from "~/utils/pageSize"

export type { Entry } from "@prisma/client"

export function calculatePageSkip(pageNumber: number): number {
  return (pageNumber - 1) * DEFAULT_PAGE_SIZE
}

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
      referenceLinks: {
        include: {
          reference: true,
        },
      },
      images: true,
      logEntries: true,
      meanings: {
        include: {
          usageNotes: true,
          seeAlso: {
            include: {
              entry: {
                select: {
                  headword: true,
                  is_public: true,
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
  page: string,
  isUserAdmin: boolean = false
) {
  // TODO: Refactor stuff like this out
  const pageNumber = parseInt(page)
  if (isNaN(pageNumber)) {
    throw new Error(`Page Number ("${page}") must be a number`)
  } else if (isNonPositive(pageNumber)) {
    throw new Error(`Page Number ("${page}") must be greater than zero`)
  }

  const skip: number = (pageNumber - 1) * DEFAULT_PAGE_SIZE
  return getEntriesByInitialLetters(
    initialLetters,
    skip,
    undefined,
    isUserAdmin
  )
}

export async function insertEntry(
  data: { [k: string]: FormDataEntryValue },
  request: Request
) {
  const email = await getEmailFromSession(request)

  const headword = getStringFromFormInput(data.headword)
  const spellingVariants = getStringFromFormInput(data.spellingVariants)
  const etymology = getStringFromFormInput(data.etymology)
  const generalLabels = getStringFromFormInput(data.generalLabels)
  const fistnote = getStringFromFormInput(data.fistnote)
  const dagger = getCheckboxValueAsBoolean(data.dagger)
  const isNonCanadian = getCheckboxValueAsBoolean(data.isNonCanadian)
  const isLegacy = getStringFromFormInput(data.dchpVersion) === "isLegacy"

  await prisma.entry.create({
    data: {
      id: undefined,
      headword: headword,
      first_field: "",
      etymology: etymology,
      is_legacy: isLegacy,
      is_public: false,
      spelling_variants: spellingVariants,
      superscript: "",
      dagger: dagger,
      general_labels: generalLabels,
      proofing_status: 1,
      proofing_user: email,
      fist_note: fistnote,
      image_file_name: null,
      comment: null,
      first_draft: true,
      revised_draft: false,
      semantically_revised: false,
      edited_for_style: false,
      proofread: false,
      chief_editor_ok: false,
      final_proofing: false,
      no_cdn_susp: false,
      no_cdn_conf: isNonCanadian, // TODO: should this be susp or conf?
      edit_status_comment: null,
      dchp_version: "dchp3",
    },
  })

  await updateLogEntries(headword, request, "Create entry")
}

export function countEntriesByInitialLetters(
  initialLetters: string,
  isUserAdmin: boolean = false
) {
  if (initialLetters.length === 0) {
    throw new Error(
      `Initial letters ("${initialLetters}") length must be greater than zero`
    )
  }
  const initialLettersWildcard = `${initialLetters}%`

  return prisma.$queryRaw<{ count: number }[]>`
    SELECT count(*) as count
    FROM det_entries
    WHERE
      LOWER(headword) LIKE LOWER(${initialLettersWildcard})
      AND (det_entries.is_public = 1 OR ${isUserAdmin})
  `
}

export function getEntriesByInitialLetters(
  initialLetters: string,
  skip: number = 0,
  take: number = DEFAULT_PAGE_SIZE,
  isUserAdmin: boolean = false
) {
  if (initialLetters.length === 0) {
    throw new Error(
      `Initial letters ("${initialLetters}") length must be greater than zero`
    )
  }
  const initialLettersWildcard = `${initialLetters}%`
  return prisma.$queryRaw<Pick<Entry, "id" | "is_public" | "headword">[]>`
    SELECT id, headword, is_public
    FROM det_entries
    WHERE
      LOWER(headword) LIKE LOWER(${initialLettersWildcard})
      AND (det_entries.is_public = 1 OR ${isUserAdmin})
    ORDER BY LOWER(headword) ASC LIMIT ${take} OFFSET ${skip}`
}

export async function updateLogEntries(
  headword: string,
  request: Request,
  action: string | undefined
) {
  const entry = await prisma.entry.findUnique({
    where: { headword: headword },
    select: { id: true },
  })

  const { userId, email } = await getUserIdAndEmail(request)
  const currentTime = new Date()

  invariant(entry, `Entry with headword "${headword}" not found`)
  invariant(userId, `User ID not found`)

  await prisma.logEntry.create({
    data: {
      entry_id: entry.id,
      user_id: userId,
      created: currentTime,
      headword,
      action,
      email,
    },
  })
}
