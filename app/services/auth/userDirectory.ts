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

import { AUTH_ROLES, type AuthRole } from "./AuthRole"
import type { ContributionCounts, DisplayUser } from "~/models/user.server"

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
  /** ISO timestamp, or null for an account that has never been used. */
  lastLogin: string | null
  loginsCount: number
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
  /**
   * Entries edited and citations created, summed across this person's local
   * rows. Zero for someone with no local row, who cannot have done any work.
   *
   * On screen so that "holds no role" can be read correctly: a contributor
   * who lost their role and an account that signed itself up and did nothing
   * are otherwise identical rows, and only one of them should be blocked.
   */
  contributions: ContributionCounts
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

export const totalContributions = (user: DirectoryUser): number =>
  user.contributions.edits + user.contributions.citations

/**
 * Someone with a row in the DCHP database and no Auth0 account: they
 * contributed before the project moved to Auth0 and cannot log in now.
 *
 * There is no column recording this. `user.is_dchp1` looks like it should say
 * so and is NULL on all 389 rows, so the absence of an Auth0 account is the
 * only evidence there is. That is why auth0Unknown is excluded: when Auth0
 * cannot be read, nobody can be called legacy, because the reason for their
 * having no account is that nothing was asked.
 */
export const isLegacyUser = (user: DirectoryUser): boolean =>
  user.presence === "localOnly"

/**
 * The most recent login across every Auth0 account on this address, as an ISO
 * timestamp. Null when there is no account, or none has ever been used.
 *
 * A caveat that belongs wherever this is displayed: the tenant is shared
 * between development, staging and production, so this is the last time the
 * person signed in to ANY of them. It describes the Auth0 account, not use of
 * the live site.
 */
export const lastLoginAt = (user: DirectoryUser): string | null => {
  const logins = user.auth0Accounts
    .map((a) => a.lastLogin)
    .filter((at): at is string => at !== null)

  return logins.length === 0 ? null : logins.sort().at(-1)!
}

export const totalLogins = (user: DirectoryUser): number =>
  user.auth0Accounts.reduce((sum, a) => sum + a.loginsCount, 0)

/**
 * Blocked out of the application: every Auth0 account on this address is
 * blocked, so there is no way left in.
 *
 * Deliberately false when only some are blocked. Someone whose accounts
 * disagree can still log in, and hiding them as "blocked" would bury exactly
 * the row an administrator needs to see.
 */
export const isFullyBlocked = (user: DirectoryUser): boolean =>
  user.auth0Accounts.length > 0 && user.auth0Accounts.every((a) => a.blocked)

/** True when some but not all of a person's Auth0 accounts are blocked. */
export const isPartiallyBlocked = (user: DirectoryUser): boolean =>
  user.auth0Accounts.length > 1 &&
  user.auth0Accounts.some((a) => a.blocked) &&
  !user.auth0Accounts.every((a) => a.blocked)

// Sorting and paging happen in the browser, from the URL. The loader fetches
// the whole directory in one go -- every Auth0 account, every role's
// membership, every local row -- so re-running it for a sort click would
// re-read Auth0 and spend rate limit to reorder data already in hand. The
// route's shouldRevalidate keeps the loader from re-running when only the
// query string changes.

export const USER_DIRECTORY_PAGE_SIZE = 25

export const SORT_COLUMNS = [
  "name",
  "email",
  "role",
  "contributions",
  "lastLogin",
  "login",
] as const
export type SortColumn = typeof SORT_COLUMNS[number]
export type SortDirection = "asc" | "desc"

export const isSortColumn = (value: unknown): value is SortColumn =>
  typeof value === "string" &&
  (SORT_COLUMNS as readonly string[]).includes(value)

// Rank rather than alphabetical, so that ascending puts the rows worth looking
// at first. Someone who can log in and holds no role is the case an audit is
// looking for, so it leads; a row with no Auth0 account at all has no role to
// speak of and sorts last.
const roleRank = (user: DirectoryUser): number => {
  if (user.auth0Accounts.length === 0) return 5
  if (user.roles.length === 0) return 0

  const seniority: AuthRole[] = [
    "Display",
    "Student / Editor",
    "Research Assistant",
    "Superadmin",
  ]
  return Math.max(...user.roles.map((role) => seniority.indexOf(role) + 1))
}

// Same idea: the states that need attention sort first.
const loginRank = (user: DirectoryUser): number => {
  if (user.presence === "auth0Unknown") return 3
  if (isPartiallyBlocked(user)) return 0
  if (user.auth0Accounts.length === 0) return 2
  if (user.auth0Accounts.every((a) => a.blocked)) return 1
  return 4
}

/**
 * A comparator per column. Text is compared with localeCompare so that
 * accented names order sensibly. A missing email sorts last in both
 * directions, because a row with no address is never what someone is looking
 * for when they sort by address.
 */
const compareBy: Record<
  SortColumn,
  (a: DirectoryUser, b: DirectoryUser) => number
> = {
  name: (a, b) => a.name.localeCompare(b.name),
  // Descending is the useful direction here, so ascending puts the accounts
  // that contributed nothing together.
  contributions: (a, b) => totalContributions(a) - totalContributions(b),
  email: (a, b) => {
    if (a.email === b.email) return 0
    if (a.email === null) return 1
    if (b.email === null) return -1
    return a.email.localeCompare(b.email)
  },
  role: (a, b) => roleRank(a) - roleRank(b),
  lastLogin: (a, b) => {
    const [x, y] = [lastLoginAt(a), lastLoginAt(b)]
    if (x === y) return 0
    // Never logged in stays at the end whichever way the sort runs, as with a
    // missing email: it is not what someone sorting by date is looking for.
    if (x === null) return 1
    if (y === null) return -1
    return x.localeCompare(y)
  },
  login: (a, b) => loginRank(a) - loginRank(b),
}

export function sortDirectoryUsers(
  users: DirectoryUser[],
  column: SortColumn,
  direction: SortDirection
): DirectoryUser[] {
  const sign = direction === "desc" ? -1 : 1

  // Copied, not sorted in place: the loader's array is React state.
  return [...users].sort((a, b) => {
    // A missing email is held at the end whichever way the sort runs, so the
    // sign is applied to the column comparison only.
    if (column === "email" && (a.email === null || b.email === null)) {
      return compareBy.email(a, b)
    }
    if (
      column === "lastLogin" &&
      (lastLoginAt(a) === null || lastLoginAt(b) === null)
    ) {
      return compareBy.lastLogin(a, b)
    }

    const byColumn = compareBy[column](a, b) * sign
    // Ties fall back to the name, so paging is stable rather than dependent on
    // the order Auth0 happened to return.
    return byColumn !== 0 ? byColumn : a.name.localeCompare(b.name)
  })
}

// Column filters. Kept here, next to the predicates they use, so the header
// menus and the route agree on what each option means.
//
// There is no "can log in" option. It would select the same people as "has
// access" in every state but one -- a legacy contributor has no account and a
// blocked person is excluded either way -- and in that one state, Auth0 being
// unreachable, it would show an empty table rather than admitting that nothing
// is known.
//
// The access filter defaults to "active" rather than "all". Most of the list
// is legacy contributors -- 243 of about 274 -- and a page for managing access
// that opens on people who have none is not much use. "Active" is deliberately
// a compound of two negatives rather than a single badge value: it means not
// blocked and not legacy, so someone whose accounts disagree with each other
// still appears, which is the row most worth seeing.

export const ACCESS_FILTERS = [
  "active",
  "partlyBlocked",
  "blocked",
  "legacy",
  "all",
] as const
export type AccessFilter = typeof ACCESS_FILTERS[number]
export const DEFAULT_ACCESS_FILTER: AccessFilter = "active"

export const ACCESS_FILTER_LABELS: Record<AccessFilter, string> = {
  active: "Has access",
  partlyBlocked: "Partly blocked",
  blocked: "Blocked",
  legacy: "Legacy — no account",
  all: "Everyone",
}

export const isAccessFilter = (value: unknown): value is AccessFilter =>
  typeof value === "string" &&
  (ACCESS_FILTERS as readonly string[]).includes(value)

export const matchesAccessFilter = (
  user: DirectoryUser,
  filter: AccessFilter
): boolean => {
  switch (filter) {
    case "all":
      return true
    case "active":
      return !isLegacyUser(user) && !isFullyBlocked(user)
    case "partlyBlocked":
      return isPartiallyBlocked(user)
    case "blocked":
      return isFullyBlocked(user)
    case "legacy":
      return isLegacyUser(user)
  }
}

/** "none" is the audit case: can log in, holds no role. */
export const ROLE_FILTERS = ["all", "none", ...AUTH_ROLES] as const
export type RoleFilter = typeof ROLE_FILTERS[number]
export const DEFAULT_ROLE_FILTER: RoleFilter = "all"

export const ROLE_FILTER_LABELS: Record<RoleFilter, string> = {
  all: "Any role",
  none: "No role",
  Display: "Display",
  "Student / Editor": "Student / Editor",
  "Research Assistant": "Research Assistant",
  Superadmin: "Superadmin",
}

export const isRoleFilter = (value: unknown): value is RoleFilter =>
  typeof value === "string" &&
  (ROLE_FILTERS as readonly string[]).includes(value)

export const matchesRoleFilter = (
  user: DirectoryUser,
  filter: RoleFilter
): boolean => {
  if (filter === "all") return true
  // A legacy contributor has no Auth0 account and so no role. Reporting them
  // under "No role" would bury the accounts that can actually log in.
  if (filter === "none")
    return user.auth0Accounts.length > 0 && user.roles.length === 0
  return user.roles.includes(filter)
}
