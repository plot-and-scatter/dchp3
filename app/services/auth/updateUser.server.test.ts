// @vitest-environment node
import { updateUserName } from "./updateUser.server"
import type { DirectoryUser } from "./userDirectory"

// A name lives in two places and the list reads whichever it finds first, so
// writing one and not the other leaves the name on screen unchanged after a
// save that said it worked. These pin that both are written, and that a
// partial write says which half did not.

const updateAuth0User = vi.fn()
const updateMany = vi.fn()

vi.mock("./management.server", () => ({
  updateAuth0User: (...a: unknown[]) => updateAuth0User(...a),
}))
vi.mock("~/db.server", () => ({
  prisma: { user: { updateMany: (...a: unknown[]) => updateMany(...a) } },
}))

const account = (
  userId: string,
  connection = "Username-Password-Authentication"
) => ({
  userId,
  connection,
  blocked: false,
  roles: [],
  lastLogin: null,
  loginsCount: 0,
})

const person = (overrides: Partial<DirectoryUser> = {}): DirectoryUser =>
  ({
    email: "a@b.c",
    name: "Old Name",
    presence: "both",
    roles: [],
    auth0Accounts: [account("auth0|1")],
    localRows: [{ id: 4 }],
    contributions: { edits: 0, citations: 0 },
    ...overrides,
  } as DirectoryUser)

const name = { firstName: "New", lastName: "Name" }

beforeEach(() => {
  vi.clearAllMocks()
  updateMany.mockResolvedValue({ count: 1 })
  updateAuth0User.mockResolvedValue({ ok: true, data: {} })
})

describe("updateUserName", () => {
  it("writes to the local row and to Auth0", async () => {
    const result = await updateUserName(person(), name)

    expect(result).toEqual({ ok: true, warnings: [] })
    expect(updateMany).toHaveBeenCalledWith({
      where: { id: { in: [4] } },
      data: { first_name: "New", last_name: "Name" },
    })
    expect(updateAuth0User).toHaveBeenCalledWith("auth0|1", {
      name: "New Name",
    })
  })

  it("writes to every local row on the address", async () => {
    // Five addresses in this database have more than one row, and they are
    // the same person.
    await updateUserName(
      person({ localRows: [{ id: 1 }, { id: 2 }] as never }),
      name
    )

    expect(updateMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: { in: [1, 2] } } })
    )
  })

  it("writes to every Auth0 account on the address", async () => {
    await updateUserName(
      person({
        auth0Accounts: [
          account("auth0|1"),
          account("google-oauth2|2", "google-oauth2"),
        ],
      }),
      name
    )

    expect(updateAuth0User).toHaveBeenCalledTimes(2)
  })

  it("reports which half failed and still counts as done", async () => {
    updateAuth0User.mockResolvedValue({
      ok: false,
      error: { kind: "api", message: "nope" },
    })

    const result = await updateUserName(person(), name)

    expect(result.ok).toBe(true)
    expect(result.warnings[0]).toContain("Auth0")
  })

  it("is not done when nothing anywhere was written", async () => {
    updateMany.mockRejectedValue(new Error("db down"))
    updateAuth0User.mockResolvedValue({
      ok: false,
      error: { kind: "api", message: "nope" },
    })

    const result = await updateUserName(person(), name)

    expect(result.ok).toBe(false)
    expect(result.warnings).toHaveLength(2)
  })

  it("writes only to Auth0 for someone with no local row", async () => {
    const result = await updateUserName(person({ localRows: [] }), name)

    expect(updateMany).not.toHaveBeenCalled()
    expect(result.ok).toBe(true)
  })
})
