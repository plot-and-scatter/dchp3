// @vitest-environment node
//
// happy-dom drops a Cookie header set on a Request, so these run in node.

import { NOT_ALLOWED_PATH } from "utils/paths"
import type * as UserRoute from "./$email"
import type * as SessionServer from "~/services/auth/session.server"
import type { AuthRole } from "~/services/auth/AuthRole"

vi.mock("~/db.server", () => ({ prisma: {} }))

const getDirectoryUserByEmail = vi.fn()
const changeUserRole = vi.fn()
const updateUserName = vi.fn()
const reissuePasswordLink = vi.fn()

vi.mock("~/services/auth/userDirectory.server", () => ({
  getDirectoryUserByEmail: (...a: unknown[]) => getDirectoryUserByEmail(...a),
}))
vi.mock("~/services/auth/updateUser.server", () => ({
  changeUserRole: (...a: unknown[]) => changeUserRole(...a),
  updateUserName: (...a: unknown[]) => updateUserName(...a),
}))
vi.mock("~/services/auth/createUser.server", () => ({
  reissuePasswordLink: (...a: unknown[]) => reissuePasswordLink(...a),
}))

let action: typeof UserRoute.action
let sessionStorage: typeof SessionServer.sessionStorage

beforeAll(async () => {
  process.env.COOKIE_SECRET = "test-cookie-secret"
  ;({ sessionStorage } = await import("~/services/auth/session.server"))
  ;({ action } = await import("./$email"))
})

const SOMEONE_ELSE = "someone.else@example.com"
const ME = "me@example.com"

beforeEach(() => {
  vi.clearAllMocks()
  changeUserRole.mockResolvedValue({ ok: true, warnings: [] })
  getDirectoryUserByEmail.mockImplementation((email: string) =>
    Promise.resolve({
      user: {
        email,
        name: "Someone",
        presence: "both",
        roles: ["Superadmin"],
        auth0Accounts: [],
        localRows: [],
        contributions: { edits: 0, citations: 0 },
      },
      auth0Error: null,
    })
  )
})

const post = async (
  { as, page, role }: { as: string | null; page: string; role: string },
  roles: AuthRole[] = ["Superadmin"]
) => {
  const session = await sessionStorage.getSession()
  // A session with roles but no address is the case worth testing: the
  // permission guard lets it through, and the self-change check then has
  // nothing to compare.
  session.set("user", {
    ...(as === null ? {} : { email: as }),
    name: "Me",
    isAdmin: true,
    roles,
  })
  const setCookie = await sessionStorage.commitSession(session)

  const body = new FormData()
  body.append("intent", "role")
  body.append("role", role)

  return {
    request: new Request(`http://localhost/admin/users/${page}`, {
      method: "POST",
      body,
      headers: { cookie: setCookie.split(";")[0] },
    }),
    params: { email: page },
    context: {},
  } as never
}

describe("changing a role", () => {
  it("changes someone else's", async () => {
    const result = await action(
      await post({ as: ME, page: SOMEONE_ELSE, role: "Display" })
    )

    expect(result).toMatchObject({ kind: "roleChanged" })
    expect(changeUserRole).toHaveBeenCalled()
  })

  it("refuses your own", async () => {
    // Demoting yourself removes the permission this page needs, so the mistake
    // takes away the means of undoing it.
    const result = await action(
      await post({ as: ME, page: ME, role: "Display" })
    )

    expect(result).toMatchObject({ kind: "error" })
    expect(changeUserRole).not.toHaveBeenCalled()
  })

  it("refuses your own whatever the case or spacing of the address", async () => {
    const result = await action(
      await post({ as: "  ME@Example.COM  ", page: ME, role: "Display" })
    )

    expect(result).toMatchObject({ kind: "error" })
    expect(changeUserRole).not.toHaveBeenCalled()
  })

  it("refuses when the session carries no address to compare", async () => {
    // Not being able to tell whose account this is is a reason to stop.
    const result = await action(
      await post({ as: null, page: SOMEONE_ELSE, role: "Display" })
    )

    expect(changeUserRole).not.toHaveBeenCalled()
  })

  it("turns away someone without the permission before any of that", async () => {
    let thrown: Response | undefined
    try {
      await action(
        await post({ as: ME, page: SOMEONE_ELSE, role: "Display" }, [
          "Research Assistant",
        ])
      )
    } catch (error) {
      thrown = error as Response
    }

    expect(thrown?.headers.get("location")).toBe(NOT_ALLOWED_PATH)
    expect(changeUserRole).not.toHaveBeenCalled()
  })
})
