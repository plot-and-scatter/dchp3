import { prisma } from "~/db.server"
import { getNumberFromFormInput } from "~/utils/generalUtils"
import { assertIsValidId } from "~/utils/numberUtils"

export async function deleteQuotations(data: {
  [k: string]: FormDataEntryValue
}) {
  const meaningId = getNumberFromFormInput(data.meaningId)
  const quotationId = getNumberFromFormInput(data.quotationId)
  assertIsValidId(meaningId)
  assertIsValidId(quotationId)

  await prisma.meaningDetCitations.delete({
    where: {
      meaning_id_citation_id: {
        meaning_id: meaningId,
        citation_id: quotationId,
      },
    },
  })

  return null
}
