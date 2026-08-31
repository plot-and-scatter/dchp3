import { getAllUsers, type DisplayUser } from "~/models/user.server"
import {
  listAllAuth0Users,
  listAuth0RoleMembers,
  listAuth0Roles,
  type Auth0Error,
  type Auth0User,
} from "./management.server"
import { isAuthRole, type AuthRole } from "./AuthRole"

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

export type AccountPresence =
  | "both"
  | "auth0Only"
  | "localOnly"
  // Auth0 could not be read, so whether this person has an account there is
  // not known. Distinct from localOnly, which is a positive finding: saying
  // "cannot log in" about everyone because Auth0 timed out would be a lie on
  // an administrator's screen.
  | "auth0Unknown"

export type DirectoryUser = {
  /** Lower-cased, the key both sides are joined on. Null only for a local row with no email. */
  email: string | null
  /** Auth0's name if there is one, otherwise the local first and last name. */
  name: string
  presence: AccountPresence
  /** From Auth0. Empty for a local-only row: this application has no other source of roles. */
  roles: AuthRole[]
  auth0UserId: string | null
  /** Auth0's blocked flag. Null when there is no Auth0 account to ask about. */
  blocked: boolean | null
  /**
   * Every local row matching this email. Normally one. The `user` table has no
   * unique index on email despite @@unique in schema.prisma, and production
   * does contain duplicates, so this is a list rather than a single row and
   * the page can show that rather than silently dropping one.
   */
  localRows: DisplayUser[]
}

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

  const byUserId = new Map<string, AuthRole[]>()

  for (const role of roles.data) {
    if (!isAuthRole(role.name)) continue

    const members = await listAuth0RoleMembers(role.id)
    if (!members.ok) return members

    for (const member of members.data) {
      const held = byUserId.get(member.user_id) ?? []
      held.push(role.name)
      byUserId.set(member.user_id, held)
    }
  }

  return { ok: true, data: byUserId }
}

export async function getUserDirectory(): Promise<UserDirectory> {
  // The local rows are read first and unconditionally: they are what the page
  // falls back to when Auth0 is unreachable.
  const localUsers = await getAllUsers()

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
      users: toLocalOnlyDirectory(localByEmail, localWithoutEmail),
      auth0Error: auth0Users.error,
    }
  }

  const roles = await getRolesByAuth0UserId()
  if (!roles.ok) {
    return {
      users: toLocalOnlyDirectory(localByEmail, localWithoutEmail),
      auth0Error: roles.error,
    }
  }

  const users: DirectoryUser[] = []
  const matchedEmails = new Set<string>()

  for (const auth0User of auth0Users.data) {
    const email = normaliseEmail(auth0User.email)
    const localRows = email ? localByEmail.get(email) ?? [] : []
    if (email && localRows.length > 0) matchedEmails.add(email)

    users.push(toDirectoryUser(auth0User, email, localRows, roles.data))
  }

  // Whatever Auth0 did not account for is local-only: a person who cannot log
  // in.
  for (const [email, rows] of localByEmail) {
    if (matchedEmails.has(email)) continue
    users.push(toLocalOnlyUser(email, rows))
  }

  for (const row of localWithoutEmail) {
    users.push(toLocalOnlyUser(null, [row]))
  }

  return { users: sortDirectory(users), auth0Error: null }
}

function toDirectoryUser(
  auth0User: Auth0User,
  email: string | null,
  localRows: DisplayUser[],
  rolesByUserId: Map<string, AuthRole[]>
): DirectoryUser {
  return {
    email,
    name:
      auth0User.name?.trim() ||
      localName(localRows[0]) ||
      email ||
      auth0User.user_id,
    presence: localRows.length > 0 ? "both" : "auth0Only",
    roles: rolesByUserId.get(auth0User.user_id) ?? [],
    auth0UserId: auth0User.user_id,
    blocked: auth0User.blocked ?? false,
    localRows,
  }
}

function toLocalOnlyUser(
  email: string | null,
  localRows: DisplayUser[],
  presence: Extract<AccountPresence, "localOnly" | "auth0Unknown"> = "localOnly"
): DirectoryUser {
  return {
    email,
    name: localName(localRows[0]) || email || `User ${localRows[0]?.id}`,
    presence,
    roles: [],
    auth0UserId: null,
    blocked: null,
    localRows,
  }
}

function toLocalOnlyDirectory(
  localByEmail: Map<string, DisplayUser[]>,
  localWithoutEmail: DisplayUser[]
): DirectoryUser[] {
  const users = [...localByEmail].map(([email, rows]) =>
    toLocalOnlyUser(email, rows, "auth0Unknown")
  )
  localWithoutEmail.forEach((row) =>
    users.push(toLocalOnlyUser(null, [row], "auth0Unknown"))
  )
  return sortDirectory(users)
}

const sortDirectory = (users: DirectoryUser[]) =>
  users.sort((a, b) => (a.email ?? a.name).localeCompare(b.email ?? b.name))
