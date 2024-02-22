import type { Entry } from "@prisma/client"
import invariant from "tiny-invariant"
import { attributeEnum } from "~/components/editing/attributeEnum"
import { prisma } from "~/db.server"
import { getEmailFromSession, getUserId } from "~/services/auth/session.server"
import {
  getCheckboxValueAsBoolean,
  getNumberFromFormInput,
  getStringFromFormInput,
} from "~/utils/generalUtils"
import { assertIsValidId, isNonPositive } from "~/utils/numberUtils"

export type { Entry } from "@prisma/client"

export const DEFAULT_PAGE_SIZE = 100

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
  // TODO: Refactor stuff like this out
  const pageNumber = parseInt(page)
  if (isNaN(pageNumber)) {
    throw new Error(`Page Number ("${page}") must be a number`)
  } else if (isNonPositive(pageNumber)) {
    throw new Error(`Page Number ("${page}") must be greater than zero`)
  }

  const skip: number = (pageNumber - 1) * DEFAULT_PAGE_SIZE
  return getEntriesByInitialLetters(initialLetters, skip)
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
      first_field: "first field",
      etymology: etymology,
      is_legacy: isLegacy,
      is_public: false,
      spelling_variants: spellingVariants,
      superscript: "Superscript",
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

  updateLogEntries(headword, request)
}

export function countEntriesByInitialLetters(initialLetters: string) {
  if (initialLetters.length === 0) {
    throw new Error(
      `Initial letters ("${initialLetters}") length must be greater than zero`
    )
  }
  const initialLettersWildcard = `${initialLetters}%`
  return prisma.$queryRaw<
    {
      count: number
    }[]
  >`SELECT count(*) as count FROM det_entries WHERE LOWER(headword) LIKE LOWER(${initialLettersWildcard})`
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

export async function updateRecordByAttributeAndType(
  type: attributeEnum,
  id: number,
  value: string
) {
  // TODO: Factor
  if (isNaN(id)) {
    throw new Error(`Error Parsing ID of element being edited`)
  } else if (isNonPositive(id)) {
    throw new Error(`Error Parsing Type and ID of element being edited`)
  }

  switch (type) {
    case attributeEnum.HEADWORD:
      await updateEntryHeadword(id, value)
      break
    case attributeEnum.ETYMOLOGY:
      await updateEntryEtymology(id, value)
      break
    case attributeEnum.LABELS:
      await updateEntryLabels(id, value)
      break
    default:
      throw new Error("Type of element being edited is not supported")
  }
}

async function assertNonDuplicateHeadword(
  id: number,
  incomingHeadword: string
) {
  const entry = await prisma.entry.findUniqueOrThrow({
    where: { id: id },
    select: { headword: true },
  })

  const currentHeadword = entry.headword
  const incomingHeadwordEntry = await prisma.entry.findUnique({
    where: { headword: incomingHeadword },
  })

  const headwordsAreDifferent = entry.headword !== incomingHeadword
  const newHeadwordWouldBeDuplicate =
    incomingHeadwordEntry !== undefined && incomingHeadwordEntry !== null

  if (headwordsAreDifferent && newHeadwordWouldBeDuplicate) {
    throw new Error(
      `"${currentHeadword}" can't be changed to "${incomingHeadword}" as an Entry for "${incomingHeadword}" already exists`
    )
  }
}

export async function updateLogEntries(headword: string, request: Request) {
  const entry = await prisma.entry.findUnique({
    where: {
      headword: headword,
    },
    select: {
      id: true,
    },
  })

  const userId = await getUserId(request)
  const currentTime = new Date()

  invariant(entry)
  invariant(userId)

  await prisma.logEntry.create({
    data: { entry_id: entry.id, user_id: userId, created: currentTime },
  })
}

export async function updateEntry(data: { [k: string]: FormDataEntryValue }) {
  const id = getNumberFromFormInput(data.id)
  assertIsValidId(id)

  const headword = getStringFromFormInput(data.headword)
  await assertNonDuplicateHeadword(id, headword)

  const spellingVariant = getStringFromFormInput(data.spellingVariant)
  const generalLabels = getStringFromFormInput(data.generalLabels)
  const etymology = getStringFromFormInput(data.etymology)
  const fistNote = getStringFromFormInput(data.fistNote)

  const dagger = getCheckboxValueAsBoolean(data.dagger)
  const isLegacy = getCheckboxValueAsBoolean(data.isLegacy)
  const isNonCanadian = getCheckboxValueAsBoolean(data.isNonCanadian)

  await prisma.entry.update({
    where: { id: id },
    data: {
      headword: headword,
      spelling_variants: spellingVariant,
      general_labels: generalLabels,
      etymology: etymology,
      fist_note: fistNote,
      dagger: dagger,
      is_legacy: isLegacy,
      no_cdn_conf: isNonCanadian,
    },
  })
}

export async function updateEntryHeadword(entryId: number, newValue: string) {
  await prisma.entry.update({
    where: { id: entryId },
    data: { headword: newValue },
  })
}

export async function updateEntryEtymology(entryId: number, newValue: string) {
  await prisma.entry.update({
    where: { id: entryId },
    data: { etymology: newValue },
  })
}

export async function updateEntryLabels(entryId: number, newValue: string) {
  await prisma.entry.update({
    where: { id: entryId },
    data: { general_labels: newValue },
  })
}
