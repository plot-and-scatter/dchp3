import { z } from "zod"
import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import { prisma } from "~/db.server"
import { ZPositiveInt } from "../ZPositiveInt"

export const DeleteReferenceLinkSchema = z
  .object({
    entryEditorFormAction: z.literal(
      EntryEditorFormActionEnum.DELETE_REFERENCE_LINK
    ),
    referenceId: ZPositiveInt,
  })
  .strict()

export async function deleteReferenceLink(
  data: z.infer<typeof DeleteReferenceLinkSchema>
) {
  await prisma.referenceLink.delete({
    where: {
      id: data.referenceId,
    },
  })
}
