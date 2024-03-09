import { prisma } from "~/db.server"
import { getStringFromFormInput } from "~/utils/generalUtils"

export async function updateEditingComment(data: {
  [k: string]: FormDataEntryValue
}) {
  const headword = getStringFromFormInput(data.headword)
  const comment = getStringFromFormInput(data.comment)

  await prisma.entry.update({
    where: {
      headword: headword,
    },
    data: {
      comment: comment,
    },
  })
}
