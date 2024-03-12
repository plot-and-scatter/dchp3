import { z } from "zod"
import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import { prisma } from "~/db.server"
import { ZPrimaryKeyInt } from "../ZPrimaryKeyInt"
import { ZCheckboxValueToBoolean } from "../ZCheckboxValueToBoolean"

export const UpdateMeaningSchema = z
  .object({
    entryEditorFormAction: z.literal(EntryEditorFormActionEnum.UPDATE_MEANING),
    meaningId: ZPrimaryKeyInt,
    definition: z.string(),
    order: z.string(),
    partOfSpeech: z.string(),
    canadianismType: z.string(),
    canadianismTypeComment: z.string(),
    dagger: ZCheckboxValueToBoolean,
  })
  .strict()

export async function updateMeaning(data: z.infer<typeof UpdateMeaningSchema>) {
  await prisma.meaning.update({
    where: { id: data.meaningId },
    data: {
      definition: data.definition,
      order: data.order,
      partofspeech: data.partOfSpeech,
      canadianism_type: data.canadianismType,
      canadianism_type_comment: data.canadianismTypeComment,
      dagger: data.dagger,
    },
  })
}
