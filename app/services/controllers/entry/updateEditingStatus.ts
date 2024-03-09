import { prisma } from "~/db.server"
import { EditingStatusTypeEnum } from "~/components/EntryEditor/EntryEditorSidebar/EditingStatus/EditingStatusTypeEnum"
import {
  getCheckboxValueAsBoolean,
  getStringFromFormInput,
} from "~/utils/generalUtils"

const EditingStatusMap: Record<EditingStatusTypeEnum, string> = {
  [EditingStatusTypeEnum.FIRST_DRAFT]: "first_draft",
  [EditingStatusTypeEnum.REVISED_DRAFT]: "revised_draft",
  [EditingStatusTypeEnum.SEMANT_REVISED]: "semantically_revised",
  [EditingStatusTypeEnum.EDITED_FOR_STYLE]: "edited_for_style",
  [EditingStatusTypeEnum.CHIEF_EDITOR_OK]: "chief_editor_ok",
  [EditingStatusTypeEnum.NO_CDN_SUSP]: "no_cdn_susp",
  [EditingStatusTypeEnum.NO_CDN_CONF]: "no_cdn_conf",
  [EditingStatusTypeEnum.COPY_EDITED]: "final_proofing",
  [EditingStatusTypeEnum.PROOF_READING]: "proofread",
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
  const fieldName = EditingStatusMap[editingStatus as EditingStatusTypeEnum]
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
