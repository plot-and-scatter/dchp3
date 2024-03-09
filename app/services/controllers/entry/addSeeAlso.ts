import { prisma } from "~/db.server"
import {
  getNumberFromFormInput,
  getStringFromFormInput,
} from "~/utils/generalUtils"

export async function addSeeAlso(data: { [k: string]: FormDataEntryValue }) {
  const meaningId = getNumberFromFormInput(data.attributeID)
  const headword = getStringFromFormInput(data.headwordToAdd)
  const linkNote = getStringFromFormInput(data.linkNote)

  const entry = await prisma.entry.findUnique({
    where: {
      headword: headword,
    },
  })

  if (entry === null) {
    throw new Error(`Entry "${headword}" could not be found`)
  }

  await prisma.seeAlso.create({
    data: {
      meaning_id: meaningId,
      entry_id: entry.id,
      linknote: linkNote,
    },
  })
}
