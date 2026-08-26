import type { z } from "zod"
import { prisma } from "~/db.server"
import type {
  CreateReferenceSchema,
  DeleteReferenceSchema,
  UpdateReferenceSchema,
} from "./reference.schemas"

export async function getReferences() {
  return prisma.reference.findMany()
}

export async function getReferenceById(id: number) {
  return prisma.reference.findFirst({ where: { id } })
}

// Moved here from app/routes/references/{create,update,delete}Reference.ts,
// which also exported the form schemas those routes validate with in the
// browser — so the modules could not be dropped from the client bundle and
// dragged ~/db.server in with them. Schemas: reference.schemas.ts.

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

export async function deleteReference(
  data: z.infer<typeof DeleteReferenceSchema>
) {
  // TODO: Assert the user has the privileges to do this.

  await prisma.reference.delete({
    where: { id: data.id },
  })
}
