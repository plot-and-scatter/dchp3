import { prisma } from "~/db.server"
import { getNumberFromFormInput } from "~/utils/generalUtils"

export async function deleteImage(data: { [k: string]: FormDataEntryValue }) {
  const imageId = getNumberFromFormInput(data.imageId)

  await prisma.image.delete({
    where: {
      id: imageId,
    },
  })
}
