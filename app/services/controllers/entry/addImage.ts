import { z } from "zod"
import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import { ZPositiveInt } from "../ZPositiveInt"
import {
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/server-runtime"
import { putS3 } from "./s3.server"
import { prisma } from "~/db.server"

// Image file validation from https://github.com/colinhacks/zod/issues/387
// const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpg", "image/jpeg"]
// const MAX_IMAGE_SIZE = 10 //In MegaBytes

// const sizeInMB = (sizeInBytes: number, decimalsNum = 2) => {
//   const result = sizeInBytes / (1024 * 1024)
//   return +result.toFixed(decimalsNum)
// }

// const ImageSchema = z
//   .custom<FileList>()
//   .refine((files) => {
//     return Array.from(files ?? []).length !== 0
//   }, "Image is required")
//   .refine((files) => {
//     return Array.from(files ?? []).every(
//       (file) => sizeInMB(file.size) <= MAX_IMAGE_SIZE
//     )
//   }, `The maximum image size is ${MAX_IMAGE_SIZE}MB`)
//   .refine((files) => {
//     return Array.from(files ?? []).every((file) =>
//       ACCEPTED_IMAGE_TYPES.includes(file.type)
//     )
//   }, "File type is not supported")

const MAX_PART_SIZE = 1e7 // 10MB

export async function fileUploadToString(
  request: Request,
  fileUploadInputName: string
) {
  const uploadHandler = unstable_createMemoryUploadHandler({
    maxPartSize: MAX_PART_SIZE,
  })
  const formData = await unstable_parseMultipartFormData(request, uploadHandler)
  const imageFile = formData.get(fileUploadInputName) as File

  console.log(imageFile)
}

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
    order: z.coerce.number().int().nullable(),
    caption: z.string().nullable(),
  })
  .strict()

export async function addImage(data: z.infer<typeof AddImageSchema>) {
  console.log("data", data)
  const imageFile = data.imageFile as File
  const size = imageFile.size
  console.log(imageFile.name)
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
