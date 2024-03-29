import { z } from "zod"
import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import { prisma } from "~/db.server"
import { ZPositiveInt } from "../ZPositiveInt"

export const UpdateOrDeleteDefinitionFistNoteSchema = z
  .object({
    entryEditorFormAction: z.literal(
      EntryEditorFormActionEnum.DEFINITION_FIST_NOTE
    ),
    usageNoteId: ZPositiveInt,
    usageNoteText: z.string().optional(),
  })
  .strict()

export async function updateOrDeleteDefinitionFistNote(
  data: z.infer<typeof UpdateOrDeleteDefinitionFistNoteSchema>
) {
  const { usageNoteId, usageNoteText } = data

  // Delete if the text is zero; otherwise, update.
  if (!usageNoteText) {
    await prisma.usageNote.delete({
      where: { id: usageNoteId },
    })
  } else {
    await prisma.usageNote.update({
      where: { id: usageNoteId },
      data: { text: usageNoteText },
    })
  }
}
