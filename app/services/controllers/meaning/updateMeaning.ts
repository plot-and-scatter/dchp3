import { prisma } from "~/db.server"
import {
  getCheckboxValueAsBoolean,
  getNumberFromFormInput,
  getStringFromFormInput,
} from "~/utils/generalUtils"
import { assertIsValidId } from "~/utils/numberUtils"

export async function updateMeaning(data: { [k: string]: FormDataEntryValue }) {
  const id = getNumberFromFormInput(data.id)
  assertIsValidId(id)

  const definition = getStringFromFormInput(data.definition)
  const order = getStringFromFormInput(data.order)
  const partOfSpeech = getStringFromFormInput(data.partOfSpeech)
  const canadianismType = getStringFromFormInput(data.canadianismType)
  const canadianismTypeComment = getStringFromFormInput(
    data.canadianismTypeComment
  )
  const dagger = getCheckboxValueAsBoolean(data.dagger)

  await prisma.meaning.update({
    where: {
      id: id,
    },
    data: {
      definition: definition,
      order: order,
      partofspeech: partOfSpeech,
      dagger: dagger,
      canadianism_type: canadianismType,
      canadianism_type_comment: canadianismTypeComment,
    },
  })
}
