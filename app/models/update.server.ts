import { EditingStatusType } from "~/components/editing/EditingStatus"
import { attributeEnum } from "~/components/editing/attributeEnum"
import { prisma } from "~/db.server"
import {
  getCheckboxValueAsBoolean,
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

export async function addMeaningToEntry(data: {
  [k: string]: FormDataEntryValue
}) {
  const id = getNumberFromFormInput(data.attributeID)
  assertIsValidId(id)

  await prisma.meaning.create({
    data: {
      entry_id: id,
      partofspeech: "",
      definition: "",
      ordernum: 0,
      orderletter: "",
      usage: "",
      dagger: false,
    },
  })
}

export async function updateMeaningHeader(data: {
  [k: string]: FormDataEntryValue
}) {
  const id = getNumberFromFormInput(data.attributeID)
  assertIsValidId(id)
  const dagger = data.dagger ? true : false
  const order = getStringFromFormInput(data.order)
  const partOfSpeech = getStringFromFormInput(data.partOfSpeech)
  const canadianismType = getStringFromFormInput(data.canadianismType)
  const usageNote = getStringFromFormInput(data.usageNote)

  await prisma.meaning.update({
    where: { id: id },
    data: {
      dagger: dagger,
      order: order,
      partofspeech: partOfSpeech,
      canadianism_type: canadianismType,
      usage: usageNote,
    },
  })
}

export async function updateMeaningDefinition(data: {
  [k: string]: FormDataEntryValue
}) {
  const id = getNumberFromFormInput(data.attributeID)
  assertIsValidId(id)
  const definition = getStringFromFormInput(data.newValue)

  await prisma.meaning.update({
    where: { id: id },
    data: {
      definition: definition,
    },
  })
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

export async function updateMeaning(data: { [k: string]: FormDataEntryValue }) {
  const id = getNumberFromFormInput(data.id)
  assertIsValidId(id)

  const definition = getStringFromFormInput(data.definition)
  const order = getStringFromFormInput(data.order)
  const partOfSpeech = getStringFromFormInput(data.partOfSpeech)
  const canadianismType = getStringFromFormInput(data.canadianismType)
  const canadianismTypeComment = getStringFromFormInput(
    data.canadianismTypeComment
  )
  const dagger = getCheckboxValueAsBoolean(data.dagger)

  await prisma.meaning.update({
    where: {
      id: id,
    },
    data: {
      definition: definition,
      order: order,
      partofspeech: partOfSpeech,
      dagger: dagger,
      canadianism_type: canadianismType,
      canadianism_type_comment: canadianismTypeComment,
    },
  })
}

export async function deleteMeaning(data: { [k: string]: FormDataEntryValue }) {
  const id = getNumberFromFormInput(data.id)
  assertIsValidId(id)

  await prisma.meaning.delete({
    where: {
      id: id,
    },
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

export async function addQuotations(data: { [k: string]: FormDataEntryValue }) {
  const meaningId = getNumberFromFormInput(data.meaningId)
  assertIsValidId(meaningId)

  let citationsToInsert = []

  for (let index in data) {
    if (index.startsWith("citationId-")) {
      let citationId = getNumberFromFormInput(data[index])
      citationsToInsert.push({ meaning_id: meaningId, citation_id: citationId })
    }
  }

  await prisma.meaningDetCitations.createMany({
    data: citationsToInsert,
    skipDuplicates: true,
  })

  return null
}

export async function deleteQuotations(data: {
  [k: string]: FormDataEntryValue
}) {
  const meaningId = getNumberFromFormInput(data.meaningId)
  const quotationId = getNumberFromFormInput(data.quotationId)
  assertIsValidId(meaningId)
  assertIsValidId(quotationId)

  await prisma.meaningDetCitations.delete({
    where: {
      meaning_id_citation_id: {
        meaning_id: meaningId,
        citation_id: quotationId,
      },
    },
  })

  return null
}

export async function updateOrDeleteDefinitionFistNote(data: {
  [k: string]: FormDataEntryValue
}) {
  const usageNoteId = getNumberFromFormInput(data.usageNoteId)
  const usageNoteText = getStringFromFormInput(data.usageNoteText)

  if (usageNoteText === "") {
    await prisma.usageNote.delete({
      where: {
        id: usageNoteId,
      },
    })
  } else {
    await prisma.usageNote.update({
      where: {
        id: usageNoteId,
      },
      data: { text: usageNoteText },
    })
  }
}

export async function addDefinitionFistNote(data: {
  [k: string]: FormDataEntryValue
}) {
  const meaningId = getNumberFromFormInput(data.meaningId)
  const defaultFistnoteText = ""

  await prisma.usageNote.create({
    data: {
      meaning_id: meaningId,
      text: defaultFistnoteText,
    },
  })
}

export async function addSeeAlso(data: { [k: string]: FormDataEntryValue }) {
  const meaningId = getNumberFromFormInput(data.attributeID)
  const headword = getStringFromFormInput(data.headwordToAdd)
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

export async function deleteSeeAlso(data: { [k: string]: FormDataEntryValue }) {
  const meaningId = getNumberFromFormInput(data.meaningId)
  const entryId = getNumberFromFormInput(data.entryId)

  await prisma.seeAlso.delete({
    where: {
      meaning_id_entry_id: {
        meaning_id: meaningId,
        entry_id: entryId,
      },
    },
  })
}

const EditingStatusMap: Record<EditingStatusType, string> = {
  [EditingStatusType.FIRST_DRAFT]: "first_draft",
  [EditingStatusType.REVISED_DRAFT]: "revised_draft",
  [EditingStatusType.SEMANT_REVISED]: "semantically_revised",
  [EditingStatusType.EDITED_FOR_STYLE]: "edited_for_style",
  [EditingStatusType.CHIEF_EDITOR_OK]: "chief_editor_ok",
  [EditingStatusType.NO_CDN_SUSP]: "no_cdn_susp",
  [EditingStatusType.NO_CDN_CONF]: "no_cdn_conf",
  [EditingStatusType.COPY_EDITED]: "final_proofing", // TODO: Confirm this with old codebase
  [EditingStatusType.PROOF_READING]: "proofread", // TODO: Also confirm this with above
}

export async function updateEditingStatus(data: {
  [k: string]: FormDataEntryValue
}) {
  const headword = getStringFromFormInput(data.headword)

  // clear all values, because checkbox values aren't passed when not on
  await resetAllEditingStatusValues(headword)
  for (const key in data) {
    await updateSingleEditingStatus(headword, key, data[key])
  }
}

async function resetAllEditingStatusValues(headword: string) {
  for (const key in EditingStatusMap) {
    await updateSingleEditingStatus(headword, key, "off")
  }
}

async function updateSingleEditingStatus(
  headword: string,
  editingStatus: string,
  value: FormDataEntryValue
) {
  const fieldName = EditingStatusMap[editingStatus as EditingStatusType]
  const bool = getCheckboxValueAsBoolean(value)

  // no-op if fieldname somehow doesn't exist
  if (!fieldName) return null

  await prisma.entry.update({
    where: {
      headword: headword,
    },
    data: {
      [fieldName]: bool,
    },
  })
}

export async function updateEditingTools(data: {
  [k: string]: FormDataEntryValue
}) {
  const headword = getStringFromFormInput(data.headword)
  const isPublic = getCheckboxValueAsBoolean(data.isPublic)
  const isLegacy = getCheckboxValueAsBoolean(data.isLegacy)

  await prisma.entry.update({
    where: {
      headword: headword,
    },
    data: {
      is_public: isPublic,
      is_legacy: isLegacy,
    },
  })
}

export async function updateEditingComment(data: {
  [k: string]: FormDataEntryValue
}) {
  const headword = getStringFromFormInput(data.headword)
  const comment = getStringFromFormInput(data.comment)

  await prisma.entry.update({
    where: {
      headword: headword,
    },
    data: {
      comment: comment,
    },
  })
}
