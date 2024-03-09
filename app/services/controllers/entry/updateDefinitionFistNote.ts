import { prisma } from "~/db.server"
import {
  getNumberFromFormInput,
  getStringFromFormInput,
} from "~/utils/generalUtils"

export async function updateOrDeleteDefinitionFistNote(data: {
  [k: string]: FormDataEntryValue
}) {
  const usageNoteId = getNumberFromFormInput(data.usageNoteId)
  const usageNoteText = getStringFromFormInput(data.usageNoteText)

  if (usageNoteText === "") {
    await prisma.usageNote.delete({
      where: {
        id: usageNoteId,
      },
    })
  } else {
    await prisma.usageNote.update({
      where: {
        id: usageNoteId,
      },
      data: { text: usageNoteText },
    })
  }
}
