import { prisma } from "~/db.server"
import { getNumberFromFormInput } from "~/utils/generalUtils"
import { assertIsValidId } from "~/utils/numberUtils"

export async function addQuotations(data: { [k: string]: FormDataEntryValue }) {
  const meaningId = getNumberFromFormInput(data.meaningId)
  assertIsValidId(meaningId)

  let citationsToInsert = []

  for (let index in data) {
    if (index.startsWith("citationId-")) {
      let citationId = getNumberFromFormInput(data[index])
      citationsToInsert.push({ meaning_id: meaningId, citation_id: citationId })
    }
  }

  await prisma.meaningDetCitations.createMany({
    data: citationsToInsert,
    skipDuplicates: true,
  })

  return null
}
