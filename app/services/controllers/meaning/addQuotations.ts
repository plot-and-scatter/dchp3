import { z } from "zod"
import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import { prisma } from "~/db.server"
import { ZPositiveInt } from "../ZPositiveInt"

export const AddQuotationsSchema = z
  .object({
    entryEditorFormAction: z.literal(EntryEditorFormActionEnum.ADD_QUOTATIONS),
    meaningId: ZPositiveInt,
    citationIds: z
      .union([ZPositiveInt, z.array(ZPositiveInt)])
      .transform((v) => {
        return Array.isArray(v) ? v : [v]
      }), // We could get a single citationId (as an int), or multiple (int[])
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
