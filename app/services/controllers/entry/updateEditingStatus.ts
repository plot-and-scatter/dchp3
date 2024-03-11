import { prisma } from "~/db.server"
import { z } from "zod"
import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import { ZCheckboxValueToBoolean } from "../ZCheckboxValueToBoolean"

// const EditingStatusMap: Record<EditingStatusTypeEnum, string> = {
//   [EditingStatusTypeEnum.FIRST_DRAFT]: "first_draft",
//   [EditingStatusTypeEnum.REVISED_DRAFT]: "revised_draft",
//   [EditingStatusTypeEnum.SEMANT_REVISED]: "semantically_revised",
//   [EditingStatusTypeEnum.EDITED_FOR_STYLE]: "edited_for_style",
//   [EditingStatusTypeEnum.CHIEF_EDITOR_OK]: "chief_editor_ok",
//   [EditingStatusTypeEnum.NO_CDN_SUSP]: "no_cdn_susp",
//   [EditingStatusTypeEnum.NO_CDN_CONF]: "no_cdn_conf",
//   [EditingStatusTypeEnum.COPY_EDITED]: "final_proofing",
//   [EditingStatusTypeEnum.PROOF_READING]: "proofread",
// }

export const UpdateEditingStatusSchema = z.object({
  entryEditorFormAction: z.literal(EntryEditorFormActionEnum.EDITING_STATUS),
  headword: z.string(),
  first_draft: ZCheckboxValueToBoolean,
  revised_draft: ZCheckboxValueToBoolean,
  semantically_revised: ZCheckboxValueToBoolean,
  edited_for_style: ZCheckboxValueToBoolean,
  chief_editor_ok: ZCheckboxValueToBoolean,
  no_cdn_susp: ZCheckboxValueToBoolean,
  no_cdn_conf: ZCheckboxValueToBoolean,
  final_proofing: ZCheckboxValueToBoolean,
  proofread: ZCheckboxValueToBoolean,
})

export async function updateEditingStatus(
  data: z.infer<typeof UpdateEditingStatusSchema>
) {
  const { entryEditorFormAction, headword, ...rest } = data

  await prisma.entry.update({
    where: { headword },
    data: { ...rest },
  })

  // TODO: I don't think this is required.
  // clear all values, because checkbox values aren't passed when not on
  // await resetAllEditingStatusValues(headword)
  // for (const key in data) {
  // await updateSingleEditingStatus(headword, key, data[key])
  // }
}

// async function resetAllEditingStatusValues(headword: string) {
//   for (const key in EditingStatusMap) {
//     await updateSingleEditingStatus(headword, key, "off")
//   }
// }

// async function updateSingleEditingStatus(
//   headword: string,
//   editingStatus: string,
//   value: FormDataEntryValue
// ) {
//   const fieldName = EditingStatusMap[editingStatus as EditingStatusTypeEnum]
//   const bool = getCheckboxValueAsBoolean(value)

//   // no-op if fieldname somehow doesn't exist
//   if (!fieldName) return null

//   await prisma.entry.update({
//     where: { headword },
//     data: {
//       [fieldName]: bool,
//     },
//   })

// }
