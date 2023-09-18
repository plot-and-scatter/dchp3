import { prisma } from "~/db.server"

export type { Reference } from "@prisma/client"

export async function getReferences() {
  return prisma.reference.findMany()
}

export async function getReferenceById(id: number) {
  return prisma.reference.findFirst({
    where: {
      id: id,
    },
  })
}

export async function addReference(
  shortDisplay: string,
  referenceText: string
) {
  await prisma.reference.create({
    data: { short_display: shortDisplay, reference_text: referenceText },
  })
}

export async function updateReferenceById(
  id: number,
  shortDisplay: string,
  referenceText: string
) {
  await prisma.reference.update({
    where: {
      id: id,
    },
    data: { short_display: shortDisplay, reference_text: referenceText },
  })
}

export async function deleteReferenceById(id: number) {
  await prisma.reference.delete({ where: { id: id } })
}
