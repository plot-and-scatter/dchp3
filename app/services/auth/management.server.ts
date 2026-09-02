// Auth0 Management API client.
//
// This is NOT the same Auth0 application as the login flow in auth.server.ts.
// That one is a Regular Web Application doing the OIDC dance with
// AUTH0_CLIENT_ID / AUTH0_CLIENT_SECRET, and its credentials cannot call the
// Management API at all. This module uses a separate Machine-to-Machine
// application, AUTH0_MGMT_CLIENT_ID / AUTH0_MGMT_CLIENT_SECRET, authorized for
// the https://<domain>/api/v2/ audience.
//
// The .server.ts suffix keeps the module out of the browser bundle. Never
// import it from a component; import it from a loader or an action only.
//
// Every exported call returns a discriminated result instead of throwing, so
// callers can render a partial page when Auth0 is unreachable rather than
// losing the whole route to an error boundary.

// Imported rather than declared here: the name is also needed in the browser,
// where deciding whether an account can have a password at all is a rendering
// question, and this module may not be loaded there.
import { DATABASE_CONNECTION } from "./userDirectory"

export type Auth0ErrorKind =
  // A required environment variable is missing.
  | "config"
  // The request never completed: DNS, TLS, timeout, connection refused.
  | "network"
  // Auth0 returned 429. See retryAfterSeconds.
  | "rate_limited"
  // Auth0 returned some other non-2xx response.
  | "api"

export type Auth0Error = {
  kind: Auth0ErrorKind
  message: string
  status?: number
  retryAfterSeconds?: number
}

export type Auth0Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: Auth0Error }

export type Auth0User = {
  user_id: string
  email?: string
  email_verified?: boolean
  name?: string
  given_name?: string
  family_name?: string
  blocked?: boolean
  created_at?: string
  last_login?: string
  logins_count?: number
  /** One entry per linked identity. Unlinked accounts have exactly one. */
  identities?: { connection?: string; provider?: string; user_id?: string }[]
}

export type Auth0Role = {
  id: string
  name: string
  description?: string
}

export { DATABASE_CONNECTION }

// Auth0 caps per_page at 100 for the user list.
const USERS_PER_PAGE = 100

// The /api/v2/users endpoint refuses to page past 1000 results unless the
// tenant has search v3 with a sort and a checkpoint cursor. DCHP has a few
// hundred users, so plain paging is fine -- but stop rather than loop forever
// if that ever stops being true.
const MAX_USER_PAGES = 20

// Refresh the token this many seconds before Auth0 says it expires, so a
// request that is in flight at the boundary does not carry a dead token.
const TOKEN_EXPIRY_SKEW_SECONDS = 60

type TokenCache = {
  accessToken: string
  // Epoch milliseconds, already reduced by TOKEN_EXPIRY_SKEW_SECONDS.
  expiresAt: number
}

// Module scope: one token per server process, not one per request.
let tokenCache: TokenCache | undefined

// Concurrent requests arriving on a cold cache must share a single token
// fetch rather than each starting their own.
let inFlightToken: Promise<Auth0Result<string>> | undefined

type ManagementConfig = {
  domain: string
  clientId: string
  clientSecret: string
}

function readConfig(): Auth0Result<ManagementConfig> {
  const domain = process.env.AUTH0_DOMAIN
  const clientId = process.env.AUTH0_MGMT_CLIENT_ID
  const clientSecret = process.env.AUTH0_MGMT_CLIENT_SECRET

  const missing = [
    !domain && "AUTH0_DOMAIN",
    !clientId && "AUTH0_MGMT_CLIENT_ID",
    !clientSecret && "AUTH0_MGMT_CLIENT_SECRET",
  ].filter(Boolean)

  if (missing.length > 0 || !domain || !clientId || !clientSecret) {
    return {
      ok: false,
      error: {
        kind: "config",
        message: `Auth0 Management API is not configured: ${missing.join(
          ", "
        )} not set.`,
      },
    }
  }

  return { ok: true, data: { domain, clientId, clientSecret } }
}

/**
 * Discard the cached token. Exported for tests; also useful if a caller ever
 * needs to force a re-authentication after a credential rotation.
 */
export function resetManagementTokenCache() {
  tokenCache = undefined
  inFlightToken = undefined
}

function describeApiError(status: number, body: string): Auth0Error {
  // Auth0 error bodies are JSON: { statusCode, error, message, errorCode }.
  // Fall back to the raw body when it is not.
  let message = body
  try {
    const parsed = JSON.parse(body)
    message = parsed.message || parsed.error_description || parsed.error || body
  } catch {
    // Leave message as the raw body.
  }

  return {
    kind: "api",
    status,
    message: `Auth0 returned ${status}: ${message || "no message"}`,
  }
}

function describeRateLimit(response: Response): Auth0Error {
  // Auth0 sends x-ratelimit-reset as an epoch second, and sometimes a
  // standard Retry-After in seconds.
  const retryAfterHeader = response.headers.get("retry-after")
  const resetHeader = response.headers.get("x-ratelimit-reset")

  let retryAfterSeconds: number | undefined

  if (retryAfterHeader && !Number.isNaN(Number(retryAfterHeader))) {
    retryAfterSeconds = Number(retryAfterHeader)
  } else if (resetHeader && !Number.isNaN(Number(resetHeader))) {
    retryAfterSeconds = Math.max(
      0,
      Math.ceil(Number(resetHeader) - Date.now() / 1000)
    )
  }

  return {
    kind: "rate_limited",
    status: 429,
    retryAfterSeconds,
    message:
      `Auth0's Management API rate limit was reached.` +
      (retryAfterSeconds !== undefined
        ? ` Try again in about ${retryAfterSeconds} second${
            retryAfterSeconds === 1 ? "" : "s"
          }.`
        : ` Try again shortly.`),
  }
}

async function fetchNewToken(): Promise<Auth0Result<string>> {
  const config = readConfig()
  if (!config.ok) return config

  const { domain, clientId, clientSecret } = config.data

  let response: Response
  try {
    response = await fetch(`https://${domain}/oauth/token`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
        audience: `https://${domain}/api/v2/`,
      }),
    })
  } catch (error) {
    return {
      ok: false,
      error: {
        kind: "network",
        message: `Could not reach Auth0 to get a Management API token: ${
          error instanceof Error ? error.message : String(error)
        }`,
      },
    }
  }

  if (response.status === 429) {
    return { ok: false, error: describeRateLimit(response) }
  }

  if (!response.ok) {
    // Deliberately not logging the body wholesale anywhere: a failed
    // client_credentials response can echo the client_id.
    return { ok: false, error: describeApiError(response.status, "") }
  }

  const body = (await response.json()) as {
    access_token?: string
    expires_in?: number
  }

  if (!body.access_token) {
    return {
      ok: false,
      error: {
        kind: "api",
        status: response.status,
        message: "Auth0 returned a token response with no access_token.",
      },
    }
  }

  // Auth0 always sends expires_in, but treat a missing value as one minute
  // rather than caching a token forever.
  const expiresIn = body.expires_in ?? TOKEN_EXPIRY_SKEW_SECONDS

  tokenCache = {
    accessToken: body.access_token,
    expiresAt:
      Date.now() + Math.max(0, expiresIn - TOKEN_EXPIRY_SKEW_SECONDS) * 1000,
  }

  return { ok: true, data: body.access_token }
}

async function getAccessToken(): Promise<Auth0Result<string>> {
  if (tokenCache && Date.now() < tokenCache.expiresAt) {
    return { ok: true, data: tokenCache.accessToken }
  }

  if (inFlightToken) return inFlightToken

  inFlightToken = fetchNewToken().finally(() => {
    inFlightToken = undefined
  })

  return inFlightToken
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE"
  body?: unknown
  searchParams?: Record<string, string>
}

/**
 * One Management API request. Returns undefined as the data for a 204.
 */
async function managementRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<Auth0Result<T>> {
  const config = readConfig()
  if (!config.ok) return config

  const token = await getAccessToken()
  if (!token.ok) return token

  const url = new URL(`https://${config.data.domain}/api/v2${path}`)
  Object.entries(options.searchParams ?? {}).forEach(([key, value]) =>
    url.searchParams.set(key, value)
  )

  let response: Response
  try {
    response = await fetch(url, {
      method: options.method ?? "GET",
      headers: {
        authorization: `Bearer ${token.data}`,
        ...(options.body !== undefined
          ? { "content-type": "application/json" }
          : {}),
      },
      ...(options.body !== undefined
        ? { body: JSON.stringify(options.body) }
        : {}),
    })
  } catch (error) {
    return {
      ok: false,
      error: {
        kind: "network",
        message: `Could not reach Auth0: ${
          error instanceof Error ? error.message : String(error)
        }`,
      },
    }
  }

  // A 401 means the cached token is no longer accepted -- revoked, or the
  // credentials rotated. Drop it so the next call gets a fresh one. Do not
  // retry here: a retry loop against a genuinely bad credential is exactly
  // what burns the rate limit.
  if (response.status === 401) {
    tokenCache = undefined
  }

  if (response.status === 429) {
    return { ok: false, error: describeRateLimit(response) }
  }

  if (!response.ok) {
    const text = await response.text().catch(() => "")
    return { ok: false, error: describeApiError(response.status, text) }
  }

  if (response.status === 204) {
    return { ok: true, data: undefined as T }
  }

  const text = await response.text()
  if (text.length === 0) return { ok: true, data: undefined as T }

  return { ok: true, data: JSON.parse(text) as T }
}

/**
 * Every user in the tenant. Pages through the list; the caller gets one array.
 */
export async function listAllAuth0Users(): Promise<Auth0Result<Auth0User[]>> {
  const users: Auth0User[] = []

  for (let page = 0; page < MAX_USER_PAGES; page++) {
    const result = await managementRequest<Auth0User[]>("/users", {
      searchParams: {
        page: String(page),
        per_page: String(USERS_PER_PAGE),
        // Sorting keeps paging stable while the list is being read.
        sort: "created_at:1",
      },
    })

    if (!result.ok) return result

    users.push(...result.data)

    // A short page is the last page.
    if (result.data.length < USERS_PER_PAGE) return { ok: true, data: users }
  }

  return {
    ok: false,
    error: {
      kind: "api",
      message: `Auth0 returned more than ${
        MAX_USER_PAGES * USERS_PER_PAGE
      } users, which this client does not page past.`,
    },
  }
}

/**
 * Every Auth0 account on one address. There is usually one, and sometimes two:
 * a person who has signed in both with Google and with a password holds two
 * unlinked accounts. See docs/auth/roles.md.
 *
 * This is a different endpoint from /users with a query, and an exact match on
 * the address rather than a search, so it is not subject to the search index
 * being a moment behind.
 */
export async function findAuth0UsersByEmail(
  email: string
): Promise<Auth0Result<Auth0User[]>> {
  return managementRequest<Auth0User[]>("/users-by-email", {
    searchParams: { email: email.trim().toLowerCase() },
  })
}

/** The roles defined in the tenant. Role IDs differ per tenant, so read them. */
export async function listAuth0Roles(): Promise<Auth0Result<Auth0Role[]>> {
  return managementRequest<Auth0Role[]>("/roles", {
    searchParams: { per_page: "100" },
  })
}

/** The roles held by one user. */
export async function getAuth0UserRoles(
  userId: string
): Promise<Auth0Result<Auth0Role[]>> {
  return managementRequest<Auth0Role[]>(
    `/users/${encodeURIComponent(userId)}/roles`,
    { searchParams: { per_page: "100" } }
  )
}

/**
 * The users holding one role. Reading membership per role costs one request
 * per role -- four for DCHP -- against one request per user the other way
 * round.
 */
export async function listAuth0RoleMembers(
  roleId: string
): Promise<Auth0Result<Auth0User[]>> {
  return managementRequest<Auth0User[]>(
    `/roles/${encodeURIComponent(roleId)}/users`,
    { searchParams: { per_page: "100" } }
  )
}

export async function createAuth0User(input: {
  email: string
  password: string
  connection?: string
  name?: string
  given_name?: string
  family_name?: string
  verify_email?: boolean
}): Promise<Auth0Result<Auth0User>> {
  const { connection = DATABASE_CONNECTION, ...rest } = input
  return managementRequest<Auth0User>("/users", {
    method: "POST",
    body: { ...rest, connection },
  })
}

export async function updateAuth0User(
  userId: string,
  changes: { blocked?: boolean; email?: string; name?: string }
): Promise<Auth0Result<Auth0User>> {
  return managementRequest<Auth0User>(`/users/${encodeURIComponent(userId)}`, {
    method: "PATCH",
    body: changes,
  })
}

/** Assigning is additive. To change a role, remove the old ones first. */
export async function assignAuth0Roles(
  userId: string,
  roleIds: string[]
): Promise<Auth0Result<void>> {
  return managementRequest<void>(`/users/${encodeURIComponent(userId)}/roles`, {
    method: "POST",
    body: { roles: roleIds },
  })
}

export async function removeAuth0Roles(
  userId: string,
  roleIds: string[]
): Promise<Auth0Result<void>> {
  return managementRequest<void>(`/users/${encodeURIComponent(userId)}/roles`, {
    method: "DELETE",
    body: { roles: roleIds },
  })
}

/**
 * A one-time link that lets the person set their own password. Used so that
 * no administrator ever handles a password on someone else's behalf.
 */
export async function createPasswordChangeTicket(input: {
  userId: string
  resultUrl?: string
  ttlSeconds?: number
  markEmailAsVerified?: boolean
}): Promise<Auth0Result<{ ticket: string }>> {
  return managementRequest<{ ticket: string }>("/tickets/password-change", {
    method: "POST",
    body: {
      user_id: input.userId,
      ...(input.resultUrl ? { result_url: input.resultUrl } : {}),
      ...(input.ttlSeconds ? { ttl_sec: input.ttlSeconds } : {}),
      ...(input.markEmailAsVerified ? { mark_email_as_verified: true } : {}),
    },
  })
}
