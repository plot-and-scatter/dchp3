import { prisma } from "~/db.server"
import { z } from "zod"
import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import { ZPrimaryKeyInt } from "../ZPrimaryKeyInt"

export const DeleteMeaningSchema = z
  .object({
    entryEditorFormAction: z.literal(EntryEditorFormActionEnum.DELETE_MEANING),
    meaningId: ZPrimaryKeyInt,
  })
  .strict()

export async function deleteMeaning(data: z.infer<typeof DeleteMeaningSchema>) {
  await prisma.meaning.delete({
    where: {
      id: data.meaningId,
    },
  })
}
