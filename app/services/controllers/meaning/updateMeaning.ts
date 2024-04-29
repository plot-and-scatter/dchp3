import { z } from "zod"
import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import { prisma } from "~/db.server"
import { ZPositiveInt } from "../ZPositiveInt"
import { ZCheckboxValueToBoolean } from "../ZCheckboxValueToBoolean"
import { ZOptionalStringToEmptyString } from "../ZOptionalStringToEmptyString"

export const UpdateMeaningSchema = z
  .object({
    entryEditorFormAction: z.literal(EntryEditorFormActionEnum.UPDATE_MEANING),
    meaningId: ZPositiveInt,
    definition: ZOptionalStringToEmptyString,
    order: ZOptionalStringToEmptyString,
    partOfSpeech: ZOptionalStringToEmptyString,
    canadianismType: ZOptionalStringToEmptyString,
    canadianismTypeComment: ZOptionalStringToEmptyString,
    usage: ZOptionalStringToEmptyString,
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
      usage: data.usage,
    },
  })
}
