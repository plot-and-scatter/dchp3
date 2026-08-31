import type { User, LogEntry, Prisma, Entry } from "@prisma/client"
import { prisma } from "~/db.server"
import { getEmailFromSession } from "~/services/auth/session.server"
import { calculatePageSkip } from "./entry.server"
import { DEFAULT_PAGE_SIZE } from "~/utils/pageSize"

export type { Entry } from "@prisma/client"
export type LogEntries = (LogEntry & { entry: Entry | null } & {
  user: User | null
})[]
export type { User } from "@prisma/client"

// The columns the user list and the profile header display. Everything these
// functions return is put straight into loader data and serialised into the
// page, so the query names its columns rather than taking the whole row: the
// `user` table also carries the pre-Auth0 login columns and several legacy
// flags, none of which any page reads.
//
// Same idea as DEFAULT_CITATION_SELECT in
// app/services/bank/defaultCitationSelect.ts.
export const USER_DISPLAY_SELECT = {
  id: true,
  email: true,
  first_name: true,
  last_name: true,
  is_active: true,
  access_level: true,
} as const

export type DisplayUser = Pick<User, keyof typeof USER_DISPLAY_SELECT>

export async function getAllUsers(): Promise<DisplayUser[]> {
  return prisma.user.findMany({
    where: {
      NOT: [
        {
          email: null,
        },
      ],
    },
    select: USER_DISPLAY_SELECT,
  })
}

export function getUserByEmailOrThrow({ email }: Pick<User, "email">) {
  return prisma.user.findFirstOrThrow({
    where: { email },
    select: USER_DISPLAY_SELECT,
  })
}

export function getUserByEmailSafe({
  email,
}: Pick<User, "email">): Promise<DisplayUser | null> {
  return prisma.user.findFirst({
    where: { email },
    select: USER_DISPLAY_SELECT,
  })
}

export function getUserIdByEmailOrThrow({ email }: Pick<User, "email">) {
  // Only the id is wanted here, and four call sites reach it, so this asks for
  // the id rather than reading a row and discarding the rest.
  return prisma.user
    .findFirstOrThrow({ where: { email }, select: { id: true } })
    .then((u) => u.id)
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
