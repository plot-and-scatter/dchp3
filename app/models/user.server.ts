import type { User } from "@prisma/client"
import { prisma } from "~/db.server"

export type { Entry } from "@prisma/client"

export const DEFAULT_PAGE_SIZE = 100

export function getUserByEmail({ email }: Pick<User, "email">) {
  return prisma.user.findFirstOrThrow({
    where: { email },
  })
}

export function getUserIdByEmail({ email }: Pick<User, "email">) {
  return getUserByEmail({ email }).then((u) => u.id)
}
