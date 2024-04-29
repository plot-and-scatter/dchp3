import { z } from "zod"
import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import { prisma } from "~/db.server"
import { ZPositiveInt } from "../ZPositiveInt"
import { ZOptionalStringToEmptyString } from "../ZOptionalStringToEmptyString"

export const UpdateEditingCommentSchema = z
  .object({
    entryEditorFormAction: z.literal(EntryEditorFormActionEnum.COMMENT),
    entryId: ZPositiveInt,
    comment: ZOptionalStringToEmptyString,
  })
  .strict()

export async function updateEditingComment(
  data: z.infer<typeof UpdateEditingCommentSchema>
) {
  const { entryId, comment } = data

  await prisma.entry.update({
    where: { id: entryId },
    data: { comment },
  })
}
