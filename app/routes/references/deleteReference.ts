import { z } from "zod"
import { prisma } from "~/db.server"
import { ReferenceActionEnum } from "./ReferenceActionEnum"
import { ZPositiveInt } from "~/services/controllers/ZPositiveInt"

export const DeleteReferenceSchema = z
  .object({
    referenceAction: z.literal(ReferenceActionEnum.DELETE_REFERENCE),
    id: ZPositiveInt,
  })
  .strict()

export async function deleteReference(
  data: z.infer<typeof DeleteReferenceSchema>
) {
  // TODO: Assert the user has the privileges to do this.

  await prisma.reference.delete({
    where: { id: data.id },
  })
}
