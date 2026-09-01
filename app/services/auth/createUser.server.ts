import { randomBytes } from "node:crypto"
import { prisma } from "~/db.server"
import { getUserByEmailSafe } from "~/models/user.server"
import { NO_ROLE, type CreateUserInput } from "~/models/user.schemas"
import {
  assignAuth0Roles,
  createAuth0User,
  createPasswordChangeTicket,
  findAuth0UsersByEmail,
  listAuth0Roles,
  type Auth0Error,
} from "./management.server"
import type { AuthRole } from "./AuthRole"

// Creating a user is four calls that can each fail on their own: Auth0's
// create, the role assignment, our own row, and the password ticket. Auth0 has
// no transaction across them, so this reports exactly how far it got rather
// than claiming success or failure for the whole.
//
// The order matters. The Auth0 account is created first because it is the only
// step that cannot be undone safely -- deleting an account is not a permission
// this application holds, deliberately -- so everything that might refuse the
// request happens before it.

/** A week. Long enough to pass on by hand, short enough to expire. */
const TICKET_TTL_SECONDS = 604800

export type CreateUserResult =
  | { ok: false; kind: "duplicate"; message: string }
  | { ok: false; kind: "failed"; message: string }
  | {
      ok: true
      auth0UserId: string
      /** The one-time link the new user follows to set their own password. */
      ticketUrl: string | null
      /** Anything that did not work after the account itself was created. */
      warnings: string[]
    }

/**
 * A password no one will ever use or see. Auth0 requires one, and the person
 * sets their own through the ticket. Long and drawn from every character class
 * so it satisfies any tenant password policy.
 */
function unusablePassword(): string {
  const bytes = randomBytes(24).toString("base64url")
  return `Aa1!${bytes}`
}

export async function createUser(
  input: CreateUserInput
): Promise<CreateUserResult> {
  const { email, firstName, lastName, role } = input

  // Both systems are checked, because either one already holding the address
  // is a reason not to go on. An address that exists in Auth0 under a social
  // connection would otherwise gain a second, unlinked account.
  const existingAuth0 = await findAuth0UsersByEmail(email)
  if (!existingAuth0.ok) {
    return {
      ok: false,
      kind: "failed",
      message: `Could not check Auth0 for that address, so nothing was created. ${existingAuth0.error.message}`,
    }
  }

  if (existingAuth0.data.length > 0) {
    const connections = existingAuth0.data
      .map((user) => user.identities?.[0]?.connection ?? "unknown")
      .join(", ")
    return {
      ok: false,
      kind: "duplicate",
      message: `${email} already has an Auth0 account (${connections}). Change their role from the list instead of creating a second account.`,
    }
  }

  const existingLocal = await getUserByEmailSafe({ email })
  if (existingLocal) {
    return {
      ok: false,
      kind: "duplicate",
      message: `${email} already has a record in this site's database. They are a legacy contributor: giving them an Auth0 account is worth doing deliberately rather than through this form.`,
    }
  }

  // The role id is read here rather than posted by the form: role ids differ
  // per tenant, and a posted one is a value from the browser.
  let roleId: string | null = null
  if (role !== NO_ROLE) {
    const roles = await listAuth0Roles()
    if (!roles.ok) {
      return {
        ok: false,
        kind: "failed",
        message: `Could not read the roles from Auth0, so nothing was created. ${roles.error.message}`,
      }
    }

    roleId = roles.data.find((r) => r.name === (role as AuthRole))?.id ?? null
    if (!roleId) {
      return {
        ok: false,
        kind: "failed",
        message: `Auth0 has no role named "${role}", so nothing was created.`,
      }
    }
  }

  const created = await createAuth0User({
    email,
    password: unusablePassword(),
    name: `${firstName} ${lastName}`,
    given_name: firstName,
    family_name: lastName,
  })

  if (!created.ok) {
    return { ok: false, kind: "failed", message: describe(created.error) }
  }

  // Past this point the account exists. Nothing below is allowed to report
  // failure for the whole operation, because saying "it failed" about an
  // account that now exists is worse than saying what did not work.
  const warnings: string[] = []

  if (roleId) {
    const assigned = await assignAuth0Roles(created.data.user_id, [roleId])
    if (!assigned.ok) {
      warnings.push(
        `The account was created but the ${role} role was not assigned: ${assigned.error.message} Set it from the list.`
      )
    }
  }

  try {
    await prisma.user.create({
      data: {
        email,
        first_name: firstName,
        last_name: lastName,
        is_active: 1,
      },
    })
  } catch (error) {
    warnings.push(
      `The Auth0 account was created but this site's own record was not: ${
        error instanceof Error ? error.message : String(error)
      } One will be created when they first sign in.`
    )
  }

  const ticket = await createPasswordChangeTicket({
    userId: created.data.user_id,
    ttlSeconds: TICKET_TTL_SECONDS,
  })

  if (!ticket.ok) {
    warnings.push(
      `The account was created but the password link could not be generated: ${ticket.error.message} Send them a password reset from Auth0 instead.`
    )
  }

  return {
    ok: true,
    auth0UserId: created.data.user_id,
    ticketUrl: ticket.ok ? ticket.data.ticket : null,
    warnings,
  }
}

export type ReissueResult =
  | { ok: true; ticketUrl: string }
  | { ok: false; message: string }

/**
 * A fresh password link for someone who already has an account.
 *
 * The reason this exists rather than leaving people to "forgot password": the
 * tenant sends mail through Auth0's built-in provider unless one has been
 * configured, which is for testing, caps at ten messages a minute and discards
 * the rest silently. This path needs no email at all -- the link comes back
 * here and is handed over by whatever means suits.
 */
export async function reissuePasswordLink(
  auth0UserId: string
): Promise<ReissueResult> {
  const ticket = await createPasswordChangeTicket({
    userId: auth0UserId,
    ttlSeconds: TICKET_TTL_SECONDS,
  })

  return ticket.ok
    ? { ok: true, ticketUrl: ticket.data.ticket }
    : { ok: false, message: ticket.error.message }
}

const describe = (error: Auth0Error) =>
  error.kind === "rate_limited"
    ? `Auth0 is rate limiting this application, so nothing was created. ${error.message}`
    : `Auth0 refused to create the account, so nothing was created. ${error.message}`
