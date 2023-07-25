import { prisma } from "~/db.server"

export type { det_references } from "@prisma/client"

export async function getReferences() {
  return prisma.det_references.findMany()
}

export async function getReferenceById(id: number) {
  return prisma.det_references.findFirst({
    where: {
      id: id,
    },
  })
}

export async function updateReferenceById(
  id: number,
  shortDisplay: string,
  referenceText: string
) {
  await prisma.det_references.update({
    where: {
      id: id,
    },
    data: { short_display: shortDisplay, reference_text: referenceText },
  })
}

export async function deleteReferenceById(id: number) {
  await prisma.det_references.delete({ where: { id: id } })
}
