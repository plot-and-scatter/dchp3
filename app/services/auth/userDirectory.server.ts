import {
  getAllUsers,
  getContributionCountsByUserId,
  type ContributionCounts,
  type DisplayUser,
} from "~/models/user.server"
import {
  listAllAuth0Users,
  listAuth0RoleMembers,
  listAuth0Roles,
  type Auth0Error,
  type Auth0User,
} from "./management.server"
import { isAuthRole, type AuthRole } from "./AuthRole"
// The shapes and pure helpers live in a module the browser may load, so that a
// component can use them without dragging ~/db.server into the client bundle.
// Re-exported here for callers already importing from this module.
import type {
  AccountPresence,
  DirectoryAuth0Account,
  DirectoryUser,
} from "./userDirectory"

export type { AccountPresence, DirectoryAuth0Account, DirectoryUser }
export { auth0UserIdsFor, isPartiallyBlocked } from "./userDirectory"

// One list of people, built from two sources that do not agree.
//
// Auth0 owns roles and owns whether someone can log in (docs/auth/roles.md).
// The local `user` table owns the rows that entries and citations are attached
// to. Neither is a superset of the other:
//
//   - auth.server.ts creates the local row lazily, at first login, so a person
//     created in Auth0 has no local row until they use it.
//   - The local table predates Auth0 and holds people who have no account.
//
// An administrator needs to see which of the three states each person is in
// rather than a list that quietly hides the disagreement.

export type UserDirectory = {
  users: DirectoryUser[]
  /**
   * Set when Auth0 could not be read. The list is then local rows only and the
   * page says so, rather than the route failing outright: an administrator who
   * cannot reach Auth0 can still see who is in the database.
   */
  auth0Error: Auth0Error | null
}

const normaliseEmail = (email: string | null | undefined) =>
  email?.trim().toLowerCase() || null

const localName = (row: DisplayUser | undefined) => {
  const name = [row?.first_name, row?.last_name]
    .filter(Boolean)
    .join(" ")
    .trim()
  return name || null
}

/**
 * Which roles each Auth0 user holds, read per role rather than per user.
 * DCHP has four roles and several hundred users, so this is four requests
 * instead of one per person.
 *
 * A role in the tenant whose name this application does not recognise is
 * skipped: it grants nothing here (see roleHasPermission), so showing it as a
 * role would misrepresent what the person can do.
 */
async function getRolesByAuth0UserId(): Promise<
  { ok: true; data: Map<string, AuthRole[]> } | { ok: false; error: Auth0Error }
> {
  const roles = await listAuth0Roles()
  if (!roles.ok) return roles

  // A role this application does not recognise grants nothing here, so it is
  // not worth a request.
  const known = roles.data.filter((role) => isAuthRole(role.name))

  // In parallel. They are independent, and run one after another they were
  // about 390ms of the page's 580ms of Auth0 time.
  const memberships = await Promise.all(
    known.map(async (role) => ({
      name: role.name as AuthRole,
      result: await listAuth0RoleMembers(role.id),
    }))
  )

  const failed = memberships.find((m) => !m.result.ok)
  if (failed && !failed.result.ok) return failed.result

  const byUserId = new Map<string, AuthRole[]>()

  for (const { name, result } of memberships) {
    if (!result.ok) continue

    for (const member of result.data) {
      const held = byUserId.get(member.user_id) ?? []
      held.push(name)
      byUserId.set(member.user_id, held)
    }
  }

  return { ok: true, data: byUserId }
}

export async function getUserDirectory(): Promise<UserDirectory> {
  // The local rows are read first and unconditionally: they are what the page
  // falls back to when Auth0 is unreachable. The contribution counts come from
  // the same database and are just as unconditional.
  const [localUsers, contributionsByUserId] = await Promise.all([
    getAllUsers(),
    getContributionCountsByUserId(),
  ])

  const contributionsFor = (rows: DisplayUser[]): ContributionCounts =>
    rows.reduce(
      (total, row) => {
        const counts = contributionsByUserId.get(row.id)
        return {
          edits: total.edits + (counts?.edits ?? 0),
          citations: total.citations + (counts?.citations ?? 0),
        }
      },
      { edits: 0, citations: 0 }
    )

  const localByEmail = new Map<string, DisplayUser[]>()
  const localWithoutEmail: DisplayUser[] = []

  for (const row of localUsers) {
    const email = normaliseEmail(row.email)
    if (!email) {
      localWithoutEmail.push(row)
      continue
    }
    localByEmail.set(email, [...(localByEmail.get(email) ?? []), row])
  }

  const auth0Users = await listAllAuth0Users()

  if (!auth0Users.ok) {
    return {
      users: toLocalOnlyDirectory(
        localByEmail,
        localWithoutEmail,
        contributionsFor
      ),
      auth0Error: auth0Users.error,
    }
  }

  const roles = await getRolesByAuth0UserId()
  if (!roles.ok) {
    return {
      users: toLocalOnlyDirectory(
        localByEmail,
        localWithoutEmail,
        contributionsFor
      ),
      auth0Error: roles.error,
    }
  }

  // Grouped by address, not one row per Auth0 account: two accounts on one
  // address are one person, and showing them as two identical-looking rows
  // would hide the thing that matters about them.
  const auth0ByEmail = new Map<string, Auth0User[]>()
  const auth0WithoutEmail: Auth0User[] = []

  for (const auth0User of auth0Users.data) {
    const email = normaliseEmail(auth0User.email)
    if (!email) {
      auth0WithoutEmail.push(auth0User)
      continue
    }
    auth0ByEmail.set(email, [...(auth0ByEmail.get(email) ?? []), auth0User])
  }

  const users: DirectoryUser[] = []
  const matchedEmails = new Set<string>()

  for (const [email, accounts] of auth0ByEmail) {
    const localRows = localByEmail.get(email) ?? []
    if (localRows.length > 0) matchedEmails.add(email)

    users.push(
      toDirectoryUser(accounts, email, localRows, roles.data, contributionsFor)
    )
  }

  for (const auth0User of auth0WithoutEmail) {
    users.push(
      toDirectoryUser([auth0User], null, [], roles.data, contributionsFor)
    )
  }

  // Whatever Auth0 did not account for is local-only: a person who cannot log
  // in.
  for (const [email, rows] of localByEmail) {
    if (matchedEmails.has(email)) continue
    users.push(toLocalOnlyUser(email, rows, contributionsFor))
  }

  for (const row of localWithoutEmail) {
    users.push(toLocalOnlyUser(null, [row], contributionsFor))
  }

  return { users: sortDirectory(users), auth0Error: null }
}

function toDirectoryUser(
  auth0Users: Auth0User[],
  email: string | null,
  localRows: DisplayUser[],
  rolesByUserId: Map<string, AuthRole[]>,
  contributions: (rows: DisplayUser[]) => ContributionCounts
): DirectoryUser {
  const accounts: DirectoryAuth0Account[] = auth0Users.map((auth0User) => ({
    userId: auth0User.user_id,
    connection: auth0User.identities?.[0]?.connection ?? null,
    blocked: auth0User.blocked ?? false,
    roles: rolesByUserId.get(auth0User.user_id) ?? [],
    lastLogin: auth0User.last_login ?? null,
    loginsCount: auth0User.logins_count ?? 0,
  }))

  return {
    email,
    name:
      auth0Users.find((u) => u.name?.trim())?.name?.trim() ||
      localName(localRows[0]) ||
      email ||
      auth0Users[0].user_id,
    presence: localRows.length > 0 ? "both" : "auth0Only",
    roles: [...new Set(accounts.flatMap((a) => a.roles))],
    auth0Accounts: accounts,
    localRows,
    contributions: contributions(localRows),
  }
}

function toLocalOnlyUser(
  email: string | null,
  localRows: DisplayUser[],
  contributions: (rows: DisplayUser[]) => ContributionCounts,
  presence: Extract<AccountPresence, "localOnly" | "auth0Unknown"> = "localOnly"
): DirectoryUser {
  return {
    email,
    name: localName(localRows[0]) || email || `User ${localRows[0]?.id}`,
    presence,
    roles: [],
    auth0Accounts: [],
    localRows,
    contributions: contributions(localRows),
  }
}

function toLocalOnlyDirectory(
  localByEmail: Map<string, DisplayUser[]>,
  localWithoutEmail: DisplayUser[],
  contributions: (rows: DisplayUser[]) => ContributionCounts
): DirectoryUser[] {
  const users = [...localByEmail].map(([email, rows]) =>
    toLocalOnlyUser(email, rows, contributions, "auth0Unknown")
  )
  localWithoutEmail.forEach((row) =>
    users.push(toLocalOnlyUser(null, [row], contributions, "auth0Unknown"))
  )
  return sortDirectory(users)
}

const sortDirectory = (users: DirectoryUser[]) =>
  users.sort((a, b) => (a.email ?? a.name).localeCompare(b.email ?? b.name))

/**
 * One person, by the address the directory joins on.
 *
 * Built from the whole directory rather than by looking that person up
 * directly. It costs the same six Auth0 requests as the list for a page that
 * shows one row, which is worth it here: assembling one person separately
 * would mean a second copy of the join, the role lookup and the contribution
 * counting, and two copies would eventually disagree about something.
 */
export async function getDirectoryUserByEmail(
  email: string
): Promise<{ user: DirectoryUser | null; auth0Error: Auth0Error | null }> {
  const wanted = normaliseEmail(email)
  const directory = await getUserDirectory()

  return {
    user: directory.users.find((user) => user.email === wanted) ?? null,
    auth0Error: directory.auth0Error,
  }
}
