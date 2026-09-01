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

export type ContributionCounts = { edits: number; citations: number }

/**
 * How much work each local user has to their name, keyed by `user.id`.
 *
 * Two grouped counts rather than a per-user query: the directory needs this
 * for every row at once, and the alternative is one query per person.
 *
 * This is what distinguishes a contributor who has lost their role from an
 * account that signed itself up and did nothing -- the two look identical
 * otherwise, and only one of them should be blocked.
 */
export async function getContributionCountsByUserId(): Promise<
  Map<number, ContributionCounts>
> {
  const [edits, citations] = await Promise.all([
    prisma.logEntry.groupBy({ by: ["user_id"], _count: { id: true } }),
    prisma.bankCitation.groupBy({ by: ["user_id"], _count: { id: true } }),
  ])

  const counts = new Map<number, ContributionCounts>()

  const add = (
    userId: number | null,
    key: keyof ContributionCounts,
    n: number
  ) => {
    if (userId === null) return
    const existing = counts.get(userId) ?? { edits: 0, citations: 0 }
    existing[key] += n
    counts.set(userId, existing)
  }

  edits.forEach((row) => add(row.user_id, "edits", row._count.id))
  citations.forEach((row) => add(row.user_id, "citations", row._count.id))

  return counts
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
