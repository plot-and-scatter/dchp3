import type { User, LogEntry, Prisma, Entry } from "@prisma/client"
import { prisma } from "~/db.server"
import { getEmailFromSession } from "~/services/auth/session.server"
import { calculatePageSkip } from "./entry.server"

export type { Entry } from "@prisma/client"
export type LogEntries = (LogEntry & { entry: Entry | null } & {
  user: User | null
})[]
export type { User } from "@prisma/client"

export const DEFAULT_PAGE_SIZE = 100

export async function getAllUsers() {
  return prisma.user.findMany({
    where: {
      NOT: [
        {
          email: null,
        },
      ],
    },
  })
}

export function getUserByEmailOrThrow({ email }: Pick<User, "email">) {
  return prisma.user.findFirstOrThrow({
    where: { email },
  })
}

export function getUserByEmailSafe({ email }: Pick<User, "email">) {
  return prisma.user.findFirst({
    where: { email },
  })
}

export function getUserIdByEmailOrThrow({ email }: Pick<User, "email">) {
  return getUserByEmailOrThrow({ email }).then((u) => u.id)
}

export async function userOwnsEntry(request: Request, headword: string) {
  const email = (await getEmailFromSession(request)) ?? ""

  const userModifiedThisEntry =
    (await prisma.entry.findFirst({
      where: {
        headword: headword,
        proofing_user: email,
      },
    })) !== null

  return Boolean(userModifiedThisEntry)
}

export async function getEntryLogsByUserEmail(
  email: string
): Promise<LogEntries> {
  const userId = await getUserIdByEmailOrThrow({ email })

  return prisma.logEntry.findMany({
    where: {
      user_id: userId,
    },
    include: {
      entry: true,
      user: true,
    },
  })
}

export async function getAllEntryLogsByPage(
  page: number,
  orderBy: string
): Promise<LogEntries> {
  const skip = calculatePageSkip(page)
  const take = DEFAULT_PAGE_SIZE

  const orderDirection: Prisma.SortOrder = orderBy === "desc" ? "desc" : "asc"

  return prisma.logEntry.findMany({
    include: {
      entry: true,
      user: true,
    },
    orderBy: {
      created: orderDirection,
    },
    skip: skip,
    take: take,
  })
}
