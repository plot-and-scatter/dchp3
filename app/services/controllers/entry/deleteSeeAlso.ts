import { prisma } from "~/db.server"
import { getNumberFromFormInput } from "~/utils/generalUtils"

export async function deleteSeeAlso(data: { [k: string]: FormDataEntryValue }) {
  const meaningId = getNumberFromFormInput(data.meaningId)
  const entryId = getNumberFromFormInput(data.entryId)

  await prisma.seeAlso.delete({
    where: {
      meaning_id_entry_id: {
        meaning_id: meaningId,
        entry_id: entryId,
      },
    },
  })
}
