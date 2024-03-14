import { z } from "zod"
import { prisma } from "~/db.server"
import { ZPositiveInt } from "../ZPositiveInt"
import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"

export const DeleteImageSchema = z.object({
  entryEditorFormAction: z.literal(EntryEditorFormActionEnum.DELETE_IMAGE),
  imageId: ZPositiveInt,
})

export async function deleteImage(data: z.infer<typeof DeleteImageSchema>) {
  await prisma.image.delete({
    where: {
      id: data.imageId,
    },
  })
}
