// @vitest-environment node
//
// The default happy-dom environment implements the fetch spec's forbidden
// header names, so `new Request(url, { headers: { cookie } })` silently drops
// the cookie and every request looks logged out. Node's Request keeps it.

import { AUTH_ROLES, roleHasPermission } from "~/services/auth/AuthRole"
import { NOT_ALLOWED_PATH } from "utils/paths"
import type { AuthRole } from "~/services/auth/AuthRole"
// Type-only imports: they name the shapes below without executing either
// module, so the dynamic imports in beforeAll still happen after
// COOKIE_SECRET is set.
import type * as AdminUsersRoute from "./users"
import type * as SessionServer from "~/services/auth/session.server"

// session.server pulls in ~/models/user.server, which builds a real
// PrismaClient at import time and needs DATABASE_URL. CI has no .env.
vi.mock("~/db.server", () => ({ prisma: {} }))

// The directory itself is covered by userDirectory.server.test.ts. These
// tests are about the guard, so the loader's data source is stubbed: a
// Superadmin getting through must not depend on Auth0 being reachable.
const getUserDirectory = vi.fn()
vi.mock("~/services/auth/userDirectory.server", () => ({
  getUserDirectory: () => getUserDirectory(),
}))

beforeEach(() => {
  getUserDirectory.mockClear()
  getUserDirectory.mockResolvedValue({ users: [], auth0Error: null })
})

// The guard is exercised through a genuine signed session cookie rather than a
// stubbed session, because the thing worth proving is that a request carrying
// the wrong roles is actually turned away -- and a mocked session would prove
// only that the mock was called. COOKIE_SECRET has to be set before
// session.server is imported, since the cookie storage is built at import
// time, so both modules are imported dynamically.
let loader: typeof AdminUsersRoute.loader
let action: typeof AdminUsersRoute.action
let sessionStorage: typeof SessionServer.sessionStorage

beforeAll(async () => {
  process.env.COOKIE_SECRET = "test-cookie-secret"
  ;({ sessionStorage } = await import("~/services/auth/session.server"))
  ;({ loader, action } = await import("./users"))
})

const requestWithRoles = async (
  roles: AuthRole[] | undefined,
  init: RequestInit = {}
) => {
  const session = await sessionStorage.getSession()

  if (roles) {
    session.set("user", {
      email: "someone@example.com",
      name: "Someone",
      isAdmin: roles.includes("Superadmin"),
      roles,
    })
  }

  const setCookie = await sessionStorage.commitSession(session)

  return new Request("http://localhost/admin/users", {
    ...init,
    headers: { ...init.headers, cookie: setCookie.split(";")[0] },
  })
}

// Loaders and actions signal a rejection by throwing a redirect Response.
const rejectionFrom = async (run: () => Promise<unknown>) => {
  try {
    await run()
  } catch (thrown) {
    return thrown as Response
  }
  return undefined
}

const args = (request: Request) =>
  ({ request, params: {}, context: {} } as never)

describe("det:manageUsers", () => {
  it("belongs to Superadmin and to no other role", () => {
    AUTH_ROLES.forEach((role) => {
      expect(roleHasPermission(role, "det:manageUsers")).toBe(
        role === "Superadmin"
      )
    })
  })
})

describe("/admin/users loader", () => {
  it("lets a Superadmin through", async () => {
    const request = await requestWithRoles(["Superadmin"])
    await expect(loader(args(request))).resolves.toEqual({
      users: [],
      auth0Error: null,
    })
  })

  it("does not read the directory for a request it turns away", async () => {
    const request = await requestWithRoles(["Display"])
    await rejectionFrom(() => loader(args(request)))

    expect(getUserDirectory).not.toHaveBeenCalled()
  })

  it.each(AUTH_ROLES.filter((role) => role !== "Superadmin"))(
    "redirects a %s away",
    async (role) => {
      const request = await requestWithRoles([role])
      const rejection = await rejectionFrom(() => loader(args(request)))

      expect(rejection).toBeInstanceOf(Response)
      expect(rejection?.status).toBe(302)
      expect(rejection?.headers.get("location")).toBe(NOT_ALLOWED_PATH)
    }
  )

  it("redirects a request with no session", async () => {
    const request = await requestWithRoles(undefined)
    const rejection = await rejectionFrom(() => loader(args(request)))

    expect(rejection?.headers.get("location")).toBe(NOT_ALLOWED_PATH)
  })

  it("redirects a user holding a role name the tenant no longer uses", async () => {
    const request = await requestWithRoles(["Admin"] as unknown as AuthRole[])
    const rejection = await rejectionFrom(() => loader(args(request)))

    expect(rejection?.headers.get("location")).toBe(NOT_ALLOWED_PATH)
  })
})

describe("/admin/users action", () => {
  const post = (roles: AuthRole[] | undefined) =>
    requestWithRoles(roles, { method: "POST", body: new FormData() })

  it("lets a Superadmin post", async () => {
    const request = await post(["Superadmin"])
    await expect(action(args(request))).resolves.toBeNull()
  })

  it.each(AUTH_ROLES.filter((role) => role !== "Superadmin"))(
    "rejects a post from a %s",
    async (role) => {
      const request = await post([role])
      const rejection = await rejectionFrom(() => action(args(request)))

      expect(rejection).toBeInstanceOf(Response)
      expect(rejection?.status).toBe(302)
      expect(rejection?.headers.get("location")).toBe(NOT_ALLOWED_PATH)
    }
  )

  it("rejects a post with no session", async () => {
    const request = await post(undefined)
    const rejection = await rejectionFrom(() => action(args(request)))

    expect(rejection?.headers.get("location")).toBe(NOT_ALLOWED_PATH)
  })
})
