import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import { prisma } from "~/db.server"
import { z } from "zod"
import { ZPositiveInt } from "../ZPositiveInt"

export const AddMeaningToEntrySchema = z
  .object({
    entryEditorFormAction: z.literal(EntryEditorFormActionEnum.ADD_MEANING),
    entryId: ZPositiveInt,
  })
  .strict()

export async function addMeaningToEntry(
  data: z.infer<typeof AddMeaningToEntrySchema>
) {
  await prisma.meaning.create({
    data: {
      entry_id: data.entryId,
      partofspeech: "",
      definition: "",
      ordernum: 0,
      orderletter: "",
      usage: "",
      dagger: false,
    },
  })
}
