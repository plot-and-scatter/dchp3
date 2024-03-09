import { prisma } from "~/db.server"
import { getNumberFromFormInput } from "~/utils/generalUtils"

export async function addDefinitionFistNote(data: {
  [k: string]: FormDataEntryValue
}) {
  const meaningId = getNumberFromFormInput(data.meaningId)
  const defaultFistnoteText = ""

  await prisma.usageNote.create({
    data: {
      meaning_id: meaningId,
      text: defaultFistnoteText,
    },
  })
}
