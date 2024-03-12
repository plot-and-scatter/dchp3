import { z } from "zod"
import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import { prisma } from "~/db.server"
import { ZPrimaryKeyInt } from "../ZPrimaryKeyInt"

export const AddQuotationsSchema = z
  .object({
    entryEditorFormAction: z.literal(EntryEditorFormActionEnum.ADD_QUOTATIONS),
    meaningId: ZPrimaryKeyInt,
    citationIds: z.array(ZPrimaryKeyInt),
  })
  .strict()

// TODO: This one will take a bit of extra doing. We need to figure out how to
// use conform's built-in helpers to add an array of citationIds.
export async function addQuotations(data: z.infer<typeof AddQuotationsSchema>) {
  let citationsToInsert = []

  for (const citationId of data.citationIds) {
    citationsToInsert.push({
      meaning_id: data.meaningId,
      citation_id: citationId,
    })
  }

  await prisma.meaningDetCitations.createMany({
    data: citationsToInsert,
    skipDuplicates: true,
  })
}
