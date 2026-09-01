// The shapes and the pure helpers for the user directory, deliberately in a
// module the browser may load.
//
// getUserDirectory itself lives in userDirectory.server.ts, because it reads
// the database and calls the Auth0 Management API. A component that imported
// a value from that module would pull ~/db.server into the client bundle --
// which is what the .server suffix exists to prevent, and what the Vite build
// refuses outright.
//
// Types alone could have stayed there, since a type-only import is erased.
// The helpers below are values, so they belong here.

import type { AuthRole } from "./AuthRole"
import type { DisplayUser } from "~/models/user.server"

export type AccountPresence =
  | "both"
  | "auth0Only"
  | "localOnly"
  // Auth0 could not be read, so whether this person has an account there is
  // not known. Distinct from localOnly, which is a positive finding: saying
  // "cannot log in" about everyone because Auth0 timed out would be a lie on
  // an administrator's screen.
  | "auth0Unknown"

export type DirectoryAuth0Account = {
  userId: string
  /** "Username-Password-Authentication", "google-oauth2", and so on. */
  connection: string | null
  blocked: boolean
  roles: AuthRole[]
}

export type DirectoryUser = {
  /** Lower-cased, the key both sides are joined on. Null only for a local row with no email. */
  email: string | null
  /** Auth0's name if there is one, otherwise the local first and last name. */
  name: string
  presence: AccountPresence
  /** The union of the roles held across every Auth0 account on this address. */
  roles: AuthRole[]
  /**
   * Every Auth0 account using this address. Usually one, but a person who has
   * signed in through a social provider and through a username and password
   * has two, unlinked, and the tenant has never used Auth0's account linking.
   * Two accounts can hold different roles and be blocked separately, so a
   * change applied to one of them leaves the other untouched -- which is why
   * this is a list and why the page shows it.
   */
  auth0Accounts: DirectoryAuth0Account[]
  /**
   * Every local row matching this email. Normally one. The `user` table has no
   * unique index on email despite @@unique in schema.prisma, and production
   * does contain duplicates, so this is a list rather than a single row and
   * the page can show that rather than silently dropping one.
   */
  localRows: DisplayUser[]
}

/**
 * Every Auth0 account id on this person's address.
 *
 * Changing a role or blocking an account acts on ONE account, so a person with
 * two unlinked accounts would keep the old role, or keep logging in, through
 * the other. #444 and #445 apply their change to all of these. See
 * docs/auth/roles.md.
 */
export const auth0UserIdsFor = (user: DirectoryUser): string[] =>
  user.auth0Accounts.map((account) => account.userId)

/** True when some but not all of a person's Auth0 accounts are blocked. */
export const isPartiallyBlocked = (user: DirectoryUser): boolean =>
  user.auth0Accounts.length > 1 &&
  user.auth0Accounts.some((a) => a.blocked) &&
  !user.auth0Accounts.every((a) => a.blocked)
