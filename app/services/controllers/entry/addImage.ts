import { z } from "zod"
import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import { ZPositiveInt } from "../ZPositiveInt"
import { putS3 } from "./s3.server"
import { prisma } from "~/db.server"

function getDateString() {
  const date = new Date()
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, "0")
  const day = `${date.getDate()}`.padStart(2, "0")
  const hour = `${date.getHours()}`.padStart(2, "0")
  const minute = `${date.getMinutes()}`.padStart(2, "0")
  const second = `${date.getSeconds()}`.padStart(2, "0")
  return `${year}-${month}-${day}-${hour}.${minute}.${second}`
}

export const AddImageSchema = z
  .object({
    entryEditorFormAction: z.literal(EntryEditorFormActionEnum.ADD_IMAGE),
    imageFile: z.instanceof(File, { message: "Image is required" }),
    entryId: ZPositiveInt,
    order: z.coerce.number().int().optional(),
    caption: z.string().optional(),
  })
  .strict()

export async function addImage(data: z.infer<typeof AddImageSchema>) {
  const imageFile = data.imageFile as File
  const size = imageFile.size
  const imageBuffer = Buffer.from(await imageFile.arrayBuffer())

  const path = `uploads/entries/${data.entryId}/${getDateString()}-${
    imageFile.name
  }`

  // TODO: Error handling
  await putS3(path, imageBuffer, size)

  await prisma.image.create({
    data: {
      entry_id: data.entryId,
      order: data.order,
      path: `/${path}`,
      caption: data.caption,
    },
  })
}
