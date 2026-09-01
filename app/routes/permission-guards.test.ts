// @vitest-environment node
//
// happy-dom implements the fetch spec's forbidden header names, so a Cookie
// header set on a Request is silently dropped and every request looks logged
// out. Node's Request keeps it, which these tests need in order to tell an
// anonymous request from an authorised one.

import { NOT_ALLOWED_PATH } from "utils/paths"
import type { AuthRole } from "~/services/auth/AuthRole"
// Type-only imports: they name the shapes below without executing either
// module, so the dynamic imports in beforeAll still happen after
// COOKIE_SECRET is set.
import type * as UsersRoute from "./users"
import type * as EditHistoryRoute from "./editHistory/$page"
import type * as ReferenceRoute from "./references/$id"
import type * as SessionServer from "~/services/auth/session.server"
import type * as BankLayout from "./bank"
import type * as BankCreate from "./bank/create"
import type * as BankEdit from "./bank/edit/$citationId"

// These loaders reach Prisma once the guard lets them through, and
// ~/db.server builds a real PrismaClient at import time. CI has no .env.
//
// Ownership is driven through this stub rather than by mocking
// userOwnsCitation itself. Partially mocking ~/models/user.server did not
// apply reliably -- session.server binds that import when it loads, and the
// two ownership tests failed on roughly half of runs with the real function
// reaching an empty prisma object. Stubbing the queries is deterministic and
// exercises the real userOwnsCitation.
const citationFindFirst = vi.fn()

vi.mock("~/db.server", () => ({
  prisma: {
    user: {
      findFirst: vi.fn().mockResolvedValue({ id: 1 }),
      findFirstOrThrow: vi.fn().mockResolvedValue({ id: 1 }),
    },
    bankCitation: {
      findFirst: (...args: unknown[]) => citationFindFirst(...args),
    },
  },
}))
vi.mock("~/models/reference.server", () => ({ getReferenceById: vi.fn() }))
vi.mock("~/services/bank/searchCitations", () => ({ searchCitations: vi.fn() }))

/** userOwnsCitation returns true when the ownership query finds a row. */
const ownsCitation = (owns: boolean) =>
  citationFindFirst.mockResolvedValue(owns ? { id: 7 } : null)

// redirectIfUserLacksPermission is async and refuses by throwing a redirect.
// Called without `await` it leaves a rejected promise nothing waits on: the
// loader runs on and returns its data, and Node then exits on the unhandled
// rejection. Every guarded loader is checked here rather than only the three
// that were wrong, so a future one added without `await` fails a test instead
// of reaching production.
let usersLoader: typeof UsersRoute.loader
let editHistoryLoader: typeof EditHistoryRoute.loader
let referenceLoader: typeof ReferenceRoute.loader
let referenceAction: typeof ReferenceRoute.action
let sessionStorage: typeof SessionServer.sessionStorage
let bankLayoutLoader: typeof BankLayout.loader
let bankCreateAction: typeof BankCreate.action
let bankEditAction: typeof BankEdit.action

beforeAll(async () => {
  process.env.COOKIE_SECRET = "test-cookie-secret"
  ;({ sessionStorage } = await import("~/services/auth/session.server"))
  ;({ loader: usersLoader } = await import("./users"))
  ;({ loader: editHistoryLoader } = await import("./editHistory/$page"))
  ;({ loader: referenceLoader, action: referenceAction } = await import(
    "./references/$id"
  ))
  ;({ loader: bankLayoutLoader } = await import("./bank"))
  ;({ action: bankCreateAction } = await import("./bank/create"))
  ;({ action: bankEditAction } = await import("./bank/edit/$citationId"))
})

beforeEach(() => {
  citationFindFirst.mockClear()
  ownsCitation(false)
})

const anonymousRequest = (url: string, init: RequestInit = {}) =>
  new Request(url, init)

const requestAsDisplayUser = (url: string, init: RequestInit = {}) =>
  requestAsRoles(["Display"], url, init)

const requestAsRoles = async (
  roles: AuthRole[],
  url: string,
  init: RequestInit = {}
) => {
  const session = await sessionStorage.getSession()
  session.set("user", {
    email: "someone@example.com",
    name: "Some One",
    isAdmin: roles.includes("Superadmin"),
    roles,
  })
  const setCookie = await sessionStorage.commitSession(session)

  return new Request(url, {
    ...init,
    headers: { ...init.headers, cookie: setCookie.split(";")[0] },
  })
}

const args = (request: Request, params = {}) =>
  ({ request, params, context: {} } as never)

// A guard that runs throws; a guard that does not run lets the loader return.
const redirectFrom = async (run: () => Promise<unknown>) => {
  try {
    const returned = await run()
    return { redirect: undefined, returned }
  } catch (thrown) {
    return { redirect: thrown as Response, returned: undefined }
  }
}

const GUARDED = [
  {
    name: "/users loader",
    url: "http://localhost/users",
    params: {},
    run: (request: Request, params: object) =>
      usersLoader(args(request, params)),
  },
  {
    name: "/editHistory/$page loader",
    url: "http://localhost/editHistory/1",
    params: { page: "1" },
    run: (request: Request, params: object) =>
      editHistoryLoader(args(request, params)),
  },
  {
    name: "/references/$id loader",
    url: "http://localhost/references/1",
    params: { id: "1" },
    run: (request: Request, params: object) =>
      referenceLoader(args(request, params)),
  },
  {
    name: "/references/$id action",
    url: "http://localhost/references/1",
    params: { id: "1" },
    run: (request: Request, params: object) =>
      referenceAction(args(request, params)),
  },
]

describe.each(GUARDED)("$name", ({ url, params, run }) => {
  it("redirects an anonymous request instead of returning data", async () => {
    const { redirect, returned } = await redirectFrom(() =>
      run(anonymousRequest(url), params)
    )

    expect(returned).toBeUndefined()
    expect(redirect).toBeInstanceOf(Response)
    expect(redirect?.status).toBe(302)
    expect(redirect?.headers.get("location")).toBe(NOT_ALLOWED_PATH)
  })

  it("redirects a logged-in user who lacks the permission", async () => {
    const request = await requestAsDisplayUser(url)
    const { redirect, returned } = await redirectFrom(() =>
      run(request, params)
    )

    expect(returned).toBeUndefined()
    expect(redirect?.headers.get("location")).toBe(NOT_ALLOWED_PATH)
  })
})

// The citation bank was protected only by the bank layout's loader, which
// asked for a session and nothing else. So anyone with an account -- including
// one holding no role at all -- could read it, and a child ACTION does not run
// a parent loader, so the delete in bank/edit/$citationId was reached with no
// check beyond having logged in.

const noRoles: AuthRole[] = []

describe("the bank requires bank:read, not merely a session", () => {
  it("turns away a logged-in user who holds no role", async () => {
    const request = await requestAsRoles(noRoles, "http://localhost/bank")
    const { redirect, returned } = await redirectFrom(() =>
      bankLayoutLoader(args(request))
    )

    expect(returned).toBeUndefined()
    expect(redirect?.headers.get("location")).toBe(NOT_ALLOWED_PATH)
  })

  it("lets a Display user in, because Display holds bank:read", async () => {
    const request = await requestAsRoles(["Display"], "http://localhost/bank")
    await expect(bankLayoutLoader(args(request))).resolves.toEqual({})
  })
})

describe("bank/create action", () => {
  const post = (roles: AuthRole[]) =>
    requestAsRoles(roles, "http://localhost/bank/create", {
      method: "POST",
      body: new FormData(),
    })

  it("turns away a role-less user before parsing the form", async () => {
    const request = await post(noRoles)
    const { redirect } = await redirectFrom(() =>
      bankCreateAction(args(request))
    )

    expect(redirect?.headers.get("location")).toBe(NOT_ALLOWED_PATH)
  })

  it("turns away a Display user, who can read the bank but not add to it", async () => {
    const request = await post(["Display"])
    const { redirect } = await redirectFrom(() =>
      bankCreateAction(args(request))
    )

    expect(redirect?.headers.get("location")).toBe(NOT_ALLOWED_PATH)
  })
})

describe("bank/edit/$citationId action", () => {
  const post = (roles: AuthRole[]) =>
    requestAsRoles(roles, "http://localhost/bank/edit/7", {
      method: "POST",
      body: new FormData(),
    })

  const runEdit = (request: Request) =>
    redirectFrom(() => bankEditAction(args(request, { citationId: "7" })))

  it("turns away a role-less user before the delete is reachable", async () => {
    const request = await post(noRoles)
    const { redirect } = await runEdit(request)

    expect(redirect?.headers.get("location")).toBe(NOT_ALLOWED_PATH)
  })

  it("turns away a Student / Editor who does not own the citation", async () => {
    ownsCitation(false)
    const request = await post(["Student / Editor"])
    const { redirect } = await runEdit(request)

    expect(redirect?.headers.get("location")).toBe(NOT_ALLOWED_PATH)
  })

  it("lets a Student / Editor past the guard for their own citation", async () => {
    ownsCitation(true)
    const request = await post(["Student / Editor"])
    const { redirect } = await runEdit(request)

    // Past the guard: whatever happens next is form parsing, not a redirect
    // to /not-allowed.
    expect(redirect?.headers.get("location")).not.toBe(NOT_ALLOWED_PATH)
  })

  it("lets a Research Assistant past without consulting ownership", async () => {
    ownsCitation(false)
    const request = await post(["Research Assistant"])
    const { redirect } = await runEdit(request)

    expect(redirect?.headers.get("location")).not.toBe(NOT_ALLOWED_PATH)
    // bank:editAny short-circuits before ownership is ever queried.
    expect(citationFindFirst).not.toHaveBeenCalled()
  })
})
