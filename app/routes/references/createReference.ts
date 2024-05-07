import { z } from "zod"
import { prisma } from "~/db.server"
import { ReferenceActionEnum } from "./ReferenceActionEnum"

export const CreateReferenceSchema = z
  .object({
    referenceAction: z.literal(ReferenceActionEnum.CREATE_REFERENCE),
    shortDisplay: z.string(),
    referenceText: z.string(),
  })
  .strict()

export async function createReference(
  data: z.infer<typeof CreateReferenceSchema>
) {
  // TODO: Assert the user has the privileges to do this.

  return await prisma.reference.create({
    data: {
      short_display: data.shortDisplay,
      reference_text: data.referenceText,
    },
  })
}
