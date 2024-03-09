import { prisma } from "~/db.server"
import {
  getNumberFromFormInput,
  getStringFromFormInput,
} from "~/utils/generalUtils"
import { assertIsValidId } from "~/utils/numberUtils"

export async function updateMeaningDefinition(data: {
  [k: string]: FormDataEntryValue
}) {
  const id = getNumberFromFormInput(data.attributeID)
  assertIsValidId(id)
  const definition = getStringFromFormInput(data.newValue)

  await prisma.meaning.update({
    where: { id: id },
    data: {
      definition: definition,
    },
  })
}
