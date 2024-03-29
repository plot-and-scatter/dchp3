import { z } from "zod"
import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import { prisma } from "~/db.server"
import { ZPositiveInt } from "../ZPositiveInt"

export const DeleteSeeAlsoSchema = z
  .object({
    entryEditorFormAction: z.literal(EntryEditorFormActionEnum.DELETE_SEE_ALSO),
    meaningId: ZPositiveInt,
    entryId: ZPositiveInt,
  })
  .strict()

export async function deleteSeeAlso(data: z.infer<typeof DeleteSeeAlsoSchema>) {
  await prisma.seeAlso.delete({
    where: {
      meaning_id_entry_id: {
        meaning_id: data.meaningId,
        entry_id: data.entryId,
      },
    },
  })
}
