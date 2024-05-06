import { z } from "zod"
import { prisma } from "~/db.server"
import { ReferenceActionEnum } from "./ReferenceActionEnum"
import { ZPositiveInt } from "~/services/controllers/ZPositiveInt"

export const UpdateReferenceSchema = z
  .object({
    referenceAction: z.literal(ReferenceActionEnum.UPDATE_REFERENCE),
    shortDisplay: z.string(),
    referenceText: z.string(),
    id: ZPositiveInt,
  })
  .strict()

export async function updateReference(
  data: z.infer<typeof UpdateReferenceSchema>
) {
  // TODO: Assert the user has the privileges to do this.

  await prisma.reference.update({
    where: { id: data.id },
    data: {
      short_display: data.shortDisplay,
      reference_text: data.referenceText,
    },
  })
}
