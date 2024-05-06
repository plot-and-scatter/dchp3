import { prisma } from "~/db.server"

export async function getReferences() {
  return prisma.reference.findMany()
}

export async function getReferenceById(id: number) {
  return prisma.reference.findFirst({ where: { id } })
}
