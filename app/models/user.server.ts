import type { user } from "@prisma/client"
import { prisma } from "~/db.server"

export type { Entry } from "@prisma/client"

export const DEFAULT_PAGE_SIZE = 100

export function getUserByEmail({ email }: Pick<user, "email">) {
  return prisma.user.findFirstOrThrow({
    where: { email },
  })
}

export function getUserIdByEmail({ email }: Pick<user, "email">) {
  return getUserByEmail({ email }).then((u) => u.id)
}
