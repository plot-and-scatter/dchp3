import { prisma } from "~/db.server"
import { getNumberFromFormInput } from "~/utils/generalUtils"
import { assertIsValidId } from "~/utils/numberUtils"

export async function addMeaningToEntry(data: {
  [k: string]: FormDataEntryValue
}) {
  const id = getNumberFromFormInput(data.attributeID)
  assertIsValidId(id)

  await prisma.meaning.create({
    data: {
      entry_id: id,
      partofspeech: "",
      definition: "",
      ordernum: 0,
      orderletter: "",
      usage: "",
      dagger: false,
    },
  })
}
