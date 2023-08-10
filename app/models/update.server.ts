import { attributeEnum } from "~/components/editing/attributeEnum"
import { prisma } from "~/db.server"
import {
  getNumberFromFormInput,
  getStringFromFormInput,
} from "~/utils/generalUtils"
import { assertIsValidId } from "~/utils/numberUtils"

const ENTRY_TYPE_MAP: Partial<Record<attributeEnum, string>> = {
  [attributeEnum.HEADWORD]: "headword",
  [attributeEnum.ETYMOLOGY]: "etymology",
  [attributeEnum.LABELS]: "general_labels",
  [attributeEnum.SPELLING_VARIANT]: "spelling_variants",
  [attributeEnum.FIST_NOTE]: "fist_note",
  [attributeEnum.DAGGER]: "dagger",
}

export async function updateRecordByAttributeAndType(
  type: attributeEnum,
  data: { [k: string]: FormDataEntryValue }
) {
  const id = getNumberFromFormInput(data.attributeID)
  const value = getStringFromFormInput(data.newValue)
  assertIsValidId(id)
  await updateEntry(id, type, value)
}

export async function updateMeaningHeader(data: {
  [k: string]: FormDataEntryValue
}) {
  const id = getNumberFromFormInput(data.attributeID)
  assertIsValidId(id)
  const dagger = data.dagger ? true : false
  await prisma.meaning.update({ where: { id: id }, data: { dagger: dagger } })
}

async function updateEntry(
  entryId: number,
  type: attributeEnum,
  newValue: string
) {
  const fieldName = ENTRY_TYPE_MAP[type]

  // If we don't know the fieldName, this is a no-op.
  if (!fieldName) return

  await prisma.entry.update({
    where: { id: entryId },
    data: { [fieldName]: newValue },
  })
}

export async function updateCanadianism(data: {
  [k: string]: FormDataEntryValue
}) {
  const meaningId = getNumberFromFormInput(data.attributeID)
  const newTypeComment = getStringFromFormInput(data.newValue)

  await prisma.meaning.update({
    where: {
      id: meaningId,
    },
    data: { canadianism_type_comment: newTypeComment },
  })
}

export async function addSeeAlso(data: { [k: string]: FormDataEntryValue }) {
  const meaningId = getNumberFromFormInput(data.attributeID)
  const headword = getStringFromFormInput(data.headword)
  const linkNote = getStringFromFormInput(data.linkNote)

  const entry = await prisma.entry.findUnique({
    where: {
      headword: headword,
    },
  })

  if (entry === null) {
    throw new Error(`Entry "${headword}" could not be found`)
  }

  await prisma.seeAlso.create({
    data: {
      meaning_id: meaningId,
      entry_id: entry.id,
      linknote: linkNote,
    },
  })
}
