import { z } from "zod"
import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import { prisma } from "~/db.server"
import { ZPositiveInt } from "../ZPositiveInt"
import { ZOptionalStringToEmptyString } from "../ZOptionalStringToEmptyString"

export const AddSeeAlsoSchema = z
  .object({
    entryEditorFormAction: z.literal(EntryEditorFormActionEnum.ADD_SEE_ALSO),
    meaningId: ZPositiveInt,
    [`headword[label]`]: z.string(),
    [`headword[value]`]: ZPositiveInt,
    linkNote: ZOptionalStringToEmptyString,
  })
  .strict()

// TODO: Isn't there a way we could do this using the entryId instead...?
export async function addSeeAlso(data: z.infer<typeof AddSeeAlsoSchema>) {
  const headword = data[`headword[label]`]

  const entry = await prisma.entry.findUnique({ where: { headword } })

  if (!entry) throw new Error(`Entry "${headword}" could not be found`)

  await prisma.seeAlso.create({
    data: {
      meaning_id: data.meaningId,
      entry_id: entry.id,
      linknote: data.linkNote,
    },
  })
}
