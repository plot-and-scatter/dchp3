import { z } from "zod"
import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import { prisma } from "~/db.server"
import { ZPrimaryKeyInt } from "../ZPrimaryKeyInt"

export const AddDefinitionFistNoteSchema = z.object({
  entryEditorFormAction: z.literal(
    EntryEditorFormActionEnum.ADD_DEFINITION_FIST_NOTE
  ),
  meaningId: ZPrimaryKeyInt,
})

export async function addDefinitionFistNote(
  data: z.infer<typeof AddDefinitionFistNoteSchema>
) {
  await prisma.usageNote.create({
    data: {
      meaning_id: data.meaningId,
      text: "", // Default text is empty.
    },
  })
}