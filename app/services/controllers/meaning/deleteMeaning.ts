import { prisma } from "~/db.server"
import { getNumberFromFormInput } from "~/utils/generalUtils"
import { assertIsValidId } from "~/utils/numberUtils"

export async function deleteMeaning(data: { [k: string]: FormDataEntryValue }) {
  const id = getNumberFromFormInput(data.id)
  assertIsValidId(id)

  await prisma.meaning.delete({
    where: {
      id: id,
    },
  })
}
