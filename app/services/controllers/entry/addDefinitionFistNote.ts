import { z } from "zod"
import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import { prisma } from "~/db.server"
import { ZPositiveInt } from "../ZPositiveInt"
import { ZOptionalStringToEmptyString } from "../ZOptionalStringToEmptyString"

export const AddDefinitionFistNoteSchema = z
  .object({
    entryEditorFormAction: z.literal(
      EntryEditorFormActionEnum.ADD_DEFINITION_FIST_NOTE
    ),
    text: ZOptionalStringToEmptyString,
    meaningId: ZPositiveInt,
  })
  .strict()

export async function addDefinitionFistNote(
  data: z.infer<typeof AddDefinitionFistNoteSchema>
) {
  await prisma.usageNote.create({
    data: {
      meaning_id: data.meaningId,
      text: data.text,
    },
  })
}
