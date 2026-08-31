import {
  assignAuth0Roles,
  createPasswordChangeTicket,
  listAllAuth0Users,
  listAuth0Roles,
  resetManagementTokenCache,
  updateAuth0User,
  type Auth0User,
} from "./management.server"

// Every test drives the client through a stubbed global fetch. Nothing here
// talks to Auth0; the point is the client's own behaviour -- token caching,
// paging, and how each failure shape is reported.

const TOKEN_URL = "https://test.auth0.test/oauth/token"

const tokenResponse = (accessToken = "token-1", expiresIn = 86400) =>
  new Response(
    JSON.stringify({ access_token: accessToken, expires_in: expiresIn }),
    { status: 200, headers: { "content-type": "application/json" } }
  )

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  })

const urlOf = (input: RequestInfo | URL) =>
  typeof input === "string"
    ? input
    : input instanceof URL
    ? input.href
    : input.url

let fetchMock: ReturnType<typeof vi.fn>

beforeEach(() => {
  process.env.AUTH0_DOMAIN = "test.auth0.test"
  process.env.AUTH0_MGMT_CLIENT_ID = "mgmt-client-id"
  process.env.AUTH0_MGMT_CLIENT_SECRET = "mgmt-client-secret"

  resetManagementTokenCache()

  fetchMock = vi.fn()
  vi.stubGlobal("fetch", fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

const tokenRequestCount = () =>
  fetchMock.mock.calls.filter(([input]) => urlOf(input) === TOKEN_URL).length

describe("Management API token caching", () => {
  it("fetches a token once and reuses it for a second call", async () => {
    fetchMock.mockImplementation((input: RequestInfo | URL) =>
      Promise.resolve(
        urlOf(input) === TOKEN_URL ? tokenResponse() : jsonResponse([])
      )
    )

    await listAuth0Roles()
    await listAuth0Roles()

    expect(tokenRequestCount()).toBe(1)
    // Two role requests, one token request.
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })

  it("sends the cached token as a bearer credential", async () => {
    fetchMock.mockImplementation((input: RequestInfo | URL) =>
      Promise.resolve(
        urlOf(input) === TOKEN_URL ? tokenResponse("abc123") : jsonResponse([])
      )
    )

    await listAuth0Roles()

    const rolesCall = fetchMock.mock.calls.find(
      ([input]) => urlOf(input) !== TOKEN_URL
    )
    expect(rolesCall?.[1].headers.authorization).toBe("Bearer abc123")
  })

  it("refetches once the token has expired", async () => {
    vi.useFakeTimers()

    // 120s of life, less the 60s safety margin, leaves 60s of usable cache.
    fetchMock.mockImplementation((input: RequestInfo | URL) =>
      Promise.resolve(
        urlOf(input) === TOKEN_URL
          ? tokenResponse("token-1", 120)
          : jsonResponse([])
      )
    )

    await listAuth0Roles()
    expect(tokenRequestCount()).toBe(1)

    vi.advanceTimersByTime(59_000)
    await listAuth0Roles()
    expect(tokenRequestCount()).toBe(1)

    vi.advanceTimersByTime(2_000)
    await listAuth0Roles()
    expect(tokenRequestCount()).toBe(2)
  })

  it("shares one token fetch between concurrent callers", async () => {
    let releaseToken: (value: Response) => void = () => {}
    const pendingToken = new Promise<Response>((resolve) => {
      releaseToken = resolve
    })

    fetchMock.mockImplementation((input: RequestInfo | URL) =>
      urlOf(input) === TOKEN_URL
        ? pendingToken
        : Promise.resolve(jsonResponse([]))
    )

    const both = Promise.all([listAuth0Roles(), listAuth0Roles()])
    releaseToken(tokenResponse())
    await both

    expect(tokenRequestCount()).toBe(1)
  })

  it("does not cache a token when Auth0 rejects the credentials", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ error: "access_denied" }, 401))

    const first = await listAuth0Roles()
    const second = await listAuth0Roles()

    expect(first.ok).toBe(false)
    expect(second.ok).toBe(false)
    expect(tokenRequestCount()).toBe(2)
  })

  it("drops the cached token after the API rejects it with a 401", async () => {
    fetchMock.mockImplementation((input: RequestInfo | URL) =>
      Promise.resolve(
        urlOf(input) === TOKEN_URL
          ? tokenResponse()
          : jsonResponse({ message: "Invalid token" }, 401)
      )
    )

    await listAuth0Roles()
    await listAuth0Roles()

    // The 401 on the first roles call invalidates the token, so the second
    // call has to fetch a new one.
    expect(tokenRequestCount()).toBe(2)
  })
})

describe("Management API failure reporting", () => {
  it("reports a missing environment variable without calling Auth0", async () => {
    delete process.env.AUTH0_MGMT_CLIENT_SECRET

    const result = await listAuth0Roles()

    expect(result.ok).toBe(false)
    expect(!result.ok && result.error.kind).toBe("config")
    expect(!result.ok && result.error.message).toContain(
      "AUTH0_MGMT_CLIENT_SECRET"
    )
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("reports a non-2xx response as an api error carrying Auth0's message", async () => {
    fetchMock.mockImplementation((input: RequestInfo | URL) =>
      Promise.resolve(
        urlOf(input) === TOKEN_URL
          ? tokenResponse()
          : jsonResponse(
              {
                statusCode: 403,
                error: "Forbidden",
                message: "Insufficient scope",
              },
              403
            )
      )
    )

    const result = await listAuth0Roles()

    expect(result.ok).toBe(false)
    expect(!result.ok && result.error.kind).toBe("api")
    expect(!result.ok && result.error.status).toBe(403)
    expect(!result.ok && result.error.message).toContain("Insufficient scope")
  })

  it("reports a 429 as rate limiting, with the wait derived from the reset header", async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(1_000_000_000 * 1000))

    fetchMock.mockImplementation((input: RequestInfo | URL) =>
      Promise.resolve(
        urlOf(input) === TOKEN_URL
          ? tokenResponse()
          : new Response("{}", {
              status: 429,
              headers: { "x-ratelimit-reset": String(1_000_000_030) },
            })
      )
    )

    const result = await listAuth0Roles()

    expect(result.ok).toBe(false)
    expect(!result.ok && result.error.kind).toBe("rate_limited")
    expect(!result.ok && result.error.retryAfterSeconds).toBe(30)
    // No retry loop: one token call and one API call, nothing more.
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it("reports an unreachable Auth0 as a network error", async () => {
    fetchMock.mockRejectedValue(new Error("getaddrinfo ENOTFOUND"))

    const result = await listAuth0Roles()

    expect(result.ok).toBe(false)
    expect(!result.ok && result.error.kind).toBe("network")
    expect(!result.ok && result.error.message).toContain("ENOTFOUND")
  })
})

describe("listAllAuth0Users", () => {
  const usersPage = (count: number, offset: number): Auth0User[] =>
    Array.from({ length: count }, (_, index) => ({
      user_id: `auth0|${offset + index}`,
      email: `user${offset + index}@example.com`,
    }))

  it("pages until Auth0 returns a short page", async () => {
    fetchMock.mockImplementation((input: RequestInfo | URL) => {
      const url = urlOf(input)
      if (url === TOKEN_URL) return Promise.resolve(tokenResponse())

      const page = Number(new URL(url).searchParams.get("page"))
      return Promise.resolve(
        jsonResponse(page === 0 ? usersPage(100, 0) : usersPage(7, 100))
      )
    })

    const result = await listAllAuth0Users()

    expect(result.ok).toBe(true)
    expect(result.ok && result.data).toHaveLength(107)
    expect(result.ok && result.data[106].email).toBe("user106@example.com")
  })

  it("stops and reports the failure when a later page errors", async () => {
    fetchMock.mockImplementation((input: RequestInfo | URL) => {
      const url = urlOf(input)
      if (url === TOKEN_URL) return Promise.resolve(tokenResponse())

      const page = Number(new URL(url).searchParams.get("page"))
      return Promise.resolve(
        page === 0
          ? jsonResponse(usersPage(100, 0))
          : jsonResponse({ message: "Service unavailable" }, 503)
      )
    })

    const result = await listAllAuth0Users()

    expect(result.ok).toBe(false)
    expect(!result.ok && result.error.status).toBe(503)
  })
})

describe("write calls", () => {
  it("sends role assignment as a POST with the role ids in the body", async () => {
    fetchMock.mockImplementation((input: RequestInfo | URL) =>
      Promise.resolve(
        urlOf(input) === TOKEN_URL
          ? tokenResponse()
          : new Response(null, { status: 204 })
      )
    )

    const result = await assignAuth0Roles("auth0|abc", ["rol_1"])

    expect(result.ok).toBe(true)

    const [input, init] = fetchMock.mock.calls.find(
      ([call]) => urlOf(call) !== TOKEN_URL
    )!
    expect(urlOf(input)).toBe(
      "https://test.auth0.test/api/v2/users/auth0%7Cabc/roles"
    )
    expect(init.method).toBe("POST")
    expect(JSON.parse(init.body)).toEqual({ roles: ["rol_1"] })
  })

  it("sends the blocked flag as a PATCH", async () => {
    fetchMock.mockImplementation((input: RequestInfo | URL) =>
      Promise.resolve(
        urlOf(input) === TOKEN_URL
          ? tokenResponse()
          : jsonResponse({ user_id: "auth0|abc", blocked: true })
      )
    )

    const result = await updateAuth0User("auth0|abc", { blocked: true })

    expect(result.ok).toBe(true)
    expect(result.ok && result.data.blocked).toBe(true)

    const [, init] = fetchMock.mock.calls.find(
      ([call]) => urlOf(call) !== TOKEN_URL
    )!
    expect(init.method).toBe("PATCH")
    expect(JSON.parse(init.body)).toEqual({ blocked: true })
  })

  it("requests a password-change ticket with the Auth0 field names", async () => {
    fetchMock.mockImplementation((input: RequestInfo | URL) =>
      Promise.resolve(
        urlOf(input) === TOKEN_URL
          ? tokenResponse()
          : jsonResponse({ ticket: "https://test.auth0.test/lo/reset?t=1" })
      )
    )

    const result = await createPasswordChangeTicket({
      userId: "auth0|abc",
      ttlSeconds: 604800,
      markEmailAsVerified: true,
    })

    expect(result.ok).toBe(true)
    expect(result.ok && result.data.ticket).toContain("/lo/reset")

    const [, init] = fetchMock.mock.calls.find(
      ([call]) => urlOf(call) !== TOKEN_URL
    )!
    expect(JSON.parse(init.body)).toEqual({
      user_id: "auth0|abc",
      ttl_sec: 604800,
      mark_email_as_verified: true,
    })
  })
})
