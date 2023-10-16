import type { User, LogEntry } from "@prisma/client"
import { redirect } from "@remix-run/server-runtime"
import { NOT_ALLOWED_PATH } from "utils/paths"
import { prisma } from "~/db.server"
import { getEmailFromSession } from "~/services/auth/session.server"

export type { Entry } from "@prisma/client"
export type LogEntries = (LogEntry & {
  entry: { headword: string }
})[]
export type { User } from "@prisma/client"

export const DEFAULT_PAGE_SIZE = 100

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

export async function redirectIfUserLacksEntry(
  request: Request,
  headword: string
) {
  if (await userOwnsEntry(request, headword)) return
  throw redirect(`${NOT_ALLOWED_PATH}`)
}

export async function getAllUsers() {
  return prisma.user.findMany({
    where: {
      NOT: [
        {
          email: null,
        },
      ],
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
    },
  })
}

export async function getEntriesByUserEmail(
  email: string
): Promise<LogEntries> {
  const userId = await getUserIdByEmailOrThrow({ email })

  return prisma.logEntry.findMany({
    where: {
      user_id: userId,
    },
    include: {
      entry: {
        select: {
          headword: true,
        },
      },
    },
  })
}
