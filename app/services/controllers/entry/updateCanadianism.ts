import { prisma } from "~/db.server"
import {
  getNumberFromFormInput,
  getStringFromFormInput,
} from "~/utils/generalUtils"

export async function updateCanadianism(data: {
  [k: string]: FormDataEntryValue
}) {
  const meaningId = getNumberFromFormInput(data.meaningId)
  const newTypeComment = getStringFromFormInput(data.newValue)

  await prisma.meaning.update({
    where: {
      id: meaningId,
    },
    data: { canadianism_type_comment: newTypeComment },
  })
}
