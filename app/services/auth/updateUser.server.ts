import { prisma } from "~/db.server"
import type { UpdateUserNameInput } from "~/models/user.schemas"
import {
  assignAuth0Roles,
  getAuth0UserRoles,
  listAuth0Roles,
  removeAuth0Roles,
  updateAuth0User,
} from "./management.server"
import {
  NO_ROLE,
  type ChangeRoleInput,
  type SetActiveInput,
} from "~/models/user.schemas"
import type { AuthRole } from "./AuthRole"
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

export type ChangeRoleResult = {
  ok: boolean
  warnings: string[]
}

/**
 * Set someone's role, replacing whatever they hold.
 *
 * Applied to every Auth0 account on the address rather than one of them. Three
 * addresses in this tenant carry two accounts, unlinked, and a role set on one
 * would leave the person's permissions depending on which button they happened
 * to press at the sign-in screen.
 *
 * Removing before adding, rather than the other way round. If the second call
 * fails either way round, one order leaves them holding both the old role and
 * the new, and the other leaves them holding none. Too little access is the
 * safer failure for an administrative tool, and it is visible on the list as
 * "No role" rather than silently generous.
 */
export async function changeUserRole(
  user: DirectoryUser,
  { role }: ChangeRoleInput
): Promise<ChangeRoleResult> {
  const warnings: string[] = []

  if (user.auth0Accounts.length === 0) {
    return {
      ok: false,
      warnings: [
        "They have no Auth0 account, so there is no role to change. Roles live in Auth0.",
      ],
    }
  }

  const tenantRoles = await listAuth0Roles()
  if (!tenantRoles.ok) {
    return {
      ok: false,
      warnings: [
        `The roles could not be read from Auth0, so nothing was changed. ${tenantRoles.error.message}`,
      ],
    }
  }

  let wantedId: string | null = null
  if (role !== NO_ROLE) {
    wantedId =
      tenantRoles.data.find((r) => r.name === (role as AuthRole))?.id ?? null

    if (!wantedId) {
      return {
        ok: false,
        warnings: [
          `Auth0 has no role named "${role}", so nothing was changed.`,
        ],
      }
    }
  }

  let changed = 0

  for (const account of user.auth0Accounts) {
    const label = account.connection === "google-oauth2" ? "Google" : "password"

    // Read from Auth0 rather than using the roles already on screen. The
    // directory filters out role names this application does not recognise,
    // and removing only the ones it knows would leave an unknown role behind.
    const held = await getAuth0UserRoles(account.userId)
    if (!held.ok) {
      warnings.push(
        `Their current roles on the ${label} account could not be read, so it was left alone: ${held.error.message}`
      )
      continue
    }

    const toRemove = held.data.filter((r) => r.id !== wantedId).map((r) => r.id)

    if (toRemove.length > 0) {
      const removed = await removeAuth0Roles(account.userId, toRemove)
      if (!removed.ok) {
        warnings.push(
          `The old role could not be removed from the ${label} account: ${removed.error.message}`
        )
        continue
      }
    }

    const alreadyHas = held.data.some((r) => r.id === wantedId)

    if (wantedId && !alreadyHas) {
      const assigned = await assignAuth0Roles(account.userId, [wantedId])
      if (!assigned.ok) {
        warnings.push(
          `The old role was removed from the ${label} account but the new one was not assigned: ${assigned.error.message} They hold no role until this is set again.`
        )
        continue
      }
    }

    changed += 1
  }

  return { ok: changed > 0, warnings }
}

export type SetActiveResult = {
  ok: boolean
  warnings: string[]
}

/**
 * Stop someone signing in, or let them again.
 *
 * Two flags, and only one of them does anything on its own. Auth0's `blocked`
 * is what actually refuses a sign-in. The local `is_active` decides how they
 * are shown and filtered, and used to be overwritten on every login, so it
 * could never mean "deactivated" -- that is fixed in auth.server.ts alongside
 * this.
 *
 * Applied to every Auth0 account on the address. Three addresses in this
 * tenant carry two, unlinked, and blocking one of them leaves the person
 * signing in through the other.
 *
 * Blocking does not end a session that is already open. Until sessions are
 * kept server-side (#465), a deactivation takes effect the next time they
 * would have to sign in, and the interface says so.
 */
export async function setUserActive(
  user: DirectoryUser,
  { active }: SetActiveInput
): Promise<SetActiveResult> {
  const warnings: string[] = []
  let changed = 0

  for (const account of user.auth0Accounts) {
    const label = account.connection === "google-oauth2" ? "Google" : "password"

    const updated = await updateAuth0User(account.userId, { blocked: !active })

    if (updated.ok) {
      changed += 1
    } else {
      warnings.push(
        `Their ${label} account in Auth0 was not ${
          active ? "unblocked" : "blocked"
        }: ${updated.error.message}${
          active ? "" : " They can still sign in with it."
        }`
      )
    }
  }

  const localIds = user.localRows.map((row) => row.id)

  if (localIds.length > 0) {
    try {
      await prisma.user.updateMany({
        where: { id: { in: localIds } },
        data: { is_active: active ? 1 : 0 },
      })
      changed += 1
    } catch (error) {
      warnings.push(
        `The record in the DCHP database was not updated: ${
          error instanceof Error ? error.message : String(error)
        }`
      )
    }
  }

  if (user.auth0Accounts.length === 0) {
    return {
      ok: changed > 0,
      warnings: [
        ...warnings,
        "They have no Auth0 account, so there was no sign-in to stop. Only how they are shown has changed.",
      ],
    }
  }

  return { ok: changed > 0, warnings }
}
