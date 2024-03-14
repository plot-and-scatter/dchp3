import { prisma } from "~/db.server"
import { z } from "zod"
import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import { ZPositiveInt } from "../ZPositiveInt"

export const DeleteMeaningSchema = z
  .object({
    entryEditorFormAction: z.literal(EntryEditorFormActionEnum.DELETE_MEANING),
    meaningId: ZPositiveInt,
  })
  .strict()

export async function deleteMeaning(data: z.infer<typeof DeleteMeaningSchema>) {
  await prisma.meaning.delete({
    where: {
      id: data.meaningId,
    },
  })
}
