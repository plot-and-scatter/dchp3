import { z } from "zod"
import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import { prisma } from "~/db.server"
import { ZPositiveInt } from "../ZPositiveInt"

export const AddReferenceLinkSchema = z
  .object({
    entryEditorFormAction: z.literal(
      EntryEditorFormActionEnum.ADD_REFERENCE_LINK
    ),
    entryId: ZPositiveInt,
    [`referenceId[label]`]: z.string(),
    [`referenceId[value]`]: ZPositiveInt,
    linkText: z.string().optional(),
    linkTarget: z.string().optional(),
  })
  .strict()

export async function addReferenceLink(
  data: z.infer<typeof AddReferenceLinkSchema>
) {
  await prisma.referenceLink.create({
    data: {
      entry_id: data.entryId,
      reference_id: data[`referenceId[value]`],
      link_text: data.linkText,
      link_target: data.linkTarget,
    },
  })
}
