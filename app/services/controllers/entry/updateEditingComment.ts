import { z } from "zod"
import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import { prisma } from "~/db.server"

export const UpdateEditingCommentSchema = z.object({
  entryEditorFormAction: z.literal(EntryEditorFormActionEnum.COMMENT),
  headword: z.string(),
  comment: z.string(),
})

export async function updateEditingComment(
  data: z.infer<typeof UpdateEditingCommentSchema>
) {
  const { headword, comment } = data

  await prisma.entry.update({
    where: { headword },
    data: { comment },
  })
}
