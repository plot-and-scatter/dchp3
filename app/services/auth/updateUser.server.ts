import { prisma } from "~/db.server"
import type { UpdateUserNameInput } from "~/models/user.schemas"
import { updateAuth0User } from "./management.server"
import type { DirectoryUser } from "./userDirectory"

// A person's name lives in two places and the list reads whichever it finds
// first, so writing only one of them leaves the name that shows unchanged
// while the form claims to have saved it.
//
// As with creating someone, the two writes cannot be made atomic, so this
// reports which of them worked rather than a single yes or no.

export type UpdateNameResult = {
  ok: boolean
  /** What did not work, in words that say what to do next. */
  warnings: string[]
}

export async function updateUserName(
  user: DirectoryUser,
  { firstName, lastName }: UpdateUserNameInput
): Promise<UpdateNameResult> {
  const warnings: string[] = []

  // Every local row on the address, not just the first: five addresses in
  // this database have more than one row, and they are the same person.
  const localIds = user.localRows.map((row) => row.id)

  if (localIds.length > 0) {
    try {
      await prisma.user.updateMany({
        where: { id: { in: localIds } },
        data: { first_name: firstName, last_name: lastName },
      })
    } catch (error) {
      warnings.push(
        `The name in the DCHP database was not changed: ${
          error instanceof Error ? error.message : String(error)
        }`
      )
    }
  }

  // Every Auth0 account too, for the same reason: one address can carry two.
  for (const account of user.auth0Accounts) {
    const updated = await updateAuth0User(account.userId, {
      name: `${firstName} ${lastName}`,
    })

    if (!updated.ok) {
      warnings.push(
        `The name on their ${
          account.connection === "google-oauth2" ? "Google" : "password"
        } account in Auth0 was not changed: ${updated.error.message}`
      )
    }
  }

  // A write that changed nothing anywhere is a failure; one that changed
  // something is worth reporting as done, with what did not.
  const attempted = localIds.length + user.auth0Accounts.length
  return { ok: warnings.length < attempted, warnings }
}
