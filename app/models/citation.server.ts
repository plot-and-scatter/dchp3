import { prisma } from "~/db.server"

export function getBankStats() {
  return prisma.$queryRaw<{
    count: number
  }>`SELECT id, headword FROM det_entries WHERE LOWER(headword) LIKE LOWER(${initialLettersWildcard}) ORDER BY LOWER(headword) ASC LIMIT ${take} OFFSET ${skip}`
}
