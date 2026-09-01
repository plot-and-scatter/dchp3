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
 * Someone with a row in this site's database and no Auth0 account: they
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
  "login",
  "record",
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

const recordRank = (user: DirectoryUser): number =>
  ({ auth0Only: 0, localOnly: 1, auth0Unknown: 2, both: 3 }[user.presence])

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
  login: (a, b) => loginRank(a) - loginRank(b),
  record: (a, b) => recordRank(a) - recordRank(b),
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

    const byColumn = compareBy[column](a, b) * sign
    // Ties fall back to the name, so paging is stable rather than dependent on
    // the order Auth0 happened to return.
    return byColumn !== 0 ? byColumn : a.name.localeCompare(b.name)
  })
}
