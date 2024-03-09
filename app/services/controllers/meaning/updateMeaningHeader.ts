import { prisma } from "~/db.server"
import {
  getNumberFromFormInput,
  getStringFromFormInput,
} from "~/utils/generalUtils"
import { assertIsValidId } from "~/utils/numberUtils"

export async function updateMeaningHeader(data: {
  [k: string]: FormDataEntryValue
}) {
  const id = getNumberFromFormInput(data.attributeID)
  assertIsValidId(id)
  const dagger = data.dagger ? true : false
  const order = getStringFromFormInput(data.order)
  const partOfSpeech = getStringFromFormInput(data.partOfSpeech)
  const canadianismType = getStringFromFormInput(data.canadianismType)
  const usageNote = getStringFromFormInput(data.usageNote)

  await prisma.meaning.update({
    where: { id: id },
    data: {
      dagger: dagger,
      order: order,
      partofspeech: partOfSpeech,
      canadianism_type: canadianismType,
      usage: usageNote,
    },
  })
}
