import { z } from "zod"
import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import { prisma } from "~/db.server"
import { ZPositiveInt } from "../ZPositiveInt"

export const DeleteReferenceSchema = z
  .object({
    entryEditorFormAction: z.literal(
      EntryEditorFormActionEnum.DELETE_REFERENCE
    ),
    referenceId: ZPositiveInt,
  })
  .strict()

export async function deleteReference(
  data: z.infer<typeof DeleteReferenceSchema>
) {
  await prisma.referenceLink.delete({
    where: {
      id: data.referenceId,
    },
  })
}
