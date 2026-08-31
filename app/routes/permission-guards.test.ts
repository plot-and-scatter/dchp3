// @vitest-environment node
//
// happy-dom implements the fetch spec's forbidden header names, so a Cookie
// header set on a Request is silently dropped and every request looks logged
// out. Node's Request keeps it, which these tests need in order to tell an
// anonymous request from an authorised one.

import { NOT_ALLOWED_PATH } from "utils/paths"
// Type-only imports: they name the shapes below without executing either
// module, so the dynamic imports in beforeAll still happen after
// COOKIE_SECRET is set.
import type * as UsersRoute from "./users"
import type * as EditHistoryRoute from "./editHistory/$page"
import type * as ReferenceRoute from "./references/$id"
import type * as SessionServer from "~/services/auth/session.server"

// These loaders reach Prisma once the guard lets them through, and
// ~/db.server builds a real PrismaClient at import time. CI has no .env.
vi.mock("~/db.server", () => ({ prisma: {} }))
vi.mock("~/models/user.server", () => ({ getAllUsers: vi.fn() }))
vi.mock("~/models/reference.server", () => ({ getReferenceById: vi.fn() }))

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

beforeAll(async () => {
  process.env.COOKIE_SECRET = "test-cookie-secret"
  ;({ sessionStorage } = await import("~/services/auth/session.server"))
  ;({ loader: usersLoader } = await import("./users"))
  ;({ loader: editHistoryLoader } = await import("./editHistory/$page"))
  ;({ loader: referenceLoader, action: referenceAction } = await import(
    "./references/$id"
  ))
})

const anonymousRequest = (url: string, init: RequestInit = {}) =>
  new Request(url, init)

const requestAsDisplayUser = async (url: string, init: RequestInit = {}) => {
  const session = await sessionStorage.getSession()
  session.set("user", {
    email: "display@example.com",
    name: "Display User",
    isAdmin: false,
    roles: ["Display"],
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
