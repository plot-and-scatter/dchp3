import { z } from "zod"
import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import { prisma } from "~/db.server"
import { ZPositiveInt } from "../ZPositiveInt"

export const DeleteQuotationSchema = z
  .object({
    entryEditorFormAction: z.literal(
      EntryEditorFormActionEnum.DELETE_QUOTATION
    ),
    meaningId: ZPositiveInt,
    citationId: ZPositiveInt,
  })
  .strict()

export async function deleteQuotation(
  data: z.infer<typeof DeleteQuotationSchema>
) {
  await prisma.meaningDetCitations.delete({
    where: {
      meaning_id_citation_id: {
        meaning_id: data.meaningId,
        citation_id: data.citationId,
      },
    },
  })
}
