import { prisma } from "~/db.server"
import { z } from "zod"
import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import { ZCheckboxValueToBoolean } from "../ZCheckboxValueToBoolean"
import { ZPositiveInt } from "../ZPositiveInt"

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

export const UpdateEditingStatusSchema = z
  .object({
    entryEditorFormAction: z.literal(EntryEditorFormActionEnum.EDITING_STATUS),
    entryId: ZPositiveInt,
    first_draft: ZCheckboxValueToBoolean,
    revised_draft: ZCheckboxValueToBoolean,
    semantically_revised: ZCheckboxValueToBoolean,
    // Retained so a stale form submitting these is not rejected by .strict();
    // updateEditingStatus discards both. See issue #476.
    edited_for_style: ZCheckboxValueToBoolean,
    chief_editor_ok: ZCheckboxValueToBoolean,
    no_cdn_susp: ZCheckboxValueToBoolean,
    no_cdn_conf: ZCheckboxValueToBoolean,
    final_proofing: ZCheckboxValueToBoolean,
    proofread: ZCheckboxValueToBoolean,
  })
  .strict()

export async function updateEditingStatus(
  data: z.infer<typeof UpdateEditingStatusSchema>
) {
  // `edited_for_style` and `no_cdn_susp` are no longer shown in the editor, so
  // the form never submits them and the schema would resolve both to false.
  // Leave them out of the update so existing values in the database stand.
  const {
    entryEditorFormAction,
    entryId,
    edited_for_style,
    no_cdn_susp,
    ...rest
  } = data

  await prisma.entry.update({
    where: { id: entryId },
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
