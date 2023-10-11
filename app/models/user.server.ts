import type { User } from "@prisma/client"
import { redirect } from "@remix-run/server-runtime"
import { NOT_ALLOWED_PATH } from "utils/paths"
import { prisma } from "~/db.server"
import { getEmailFromSession } from "~/services/auth/session.server"

export type { Entry } from "@prisma/client"

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

export async function redirectIfUserLacksEntry(
  request: Request,
  headword: string
) {
  const email = (await getEmailFromSession(request)) ?? ""

  const userModifiedThisEntry =
    (await prisma.entry.findFirst({
      where: {
        headword: headword,
        proofing_user: email,
      },
    })) !== null

  if (userModifiedThisEntry) return
  throw redirect(`${NOT_ALLOWED_PATH}`)
}
