import { z } from "zod"
import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import { ZPositiveInt } from "../ZPositiveInt"
import { prisma } from "~/db.server"

export const UpdateImageSchema = z
  .object({
    entryEditorFormAction: z.literal(EntryEditorFormActionEnum.EDIT_IMAGE),
    imageId: ZPositiveInt,
    order: z.coerce.number().int().nullable(),
    caption: z.string().nullable(),
  })
  .strict()

export async function updateImage(data: z.infer<typeof UpdateImageSchema>) {
  await prisma.image.update({
    where: {
      id: data.imageId,
    },
    data: {
      order: data.order,
      caption: data.caption,
    },
  })
}
