// @vitest-environment node
import {
  changeUserRole,
  setUserActive,
  updateUserName,
} from "./updateUser.server"
import type { DirectoryUser } from "./userDirectory"

// A name lives in two places and the list reads whichever it finds first, so
// writing one and not the other leaves the name on screen unchanged after a
// save that said it worked. These pin that both are written, and that a
// partial write says which half did not.

const updateAuth0User = vi.fn()
const updateMany = vi.fn()
const listAuth0Roles = vi.fn()
const getAuth0UserRoles = vi.fn()
const assignAuth0Roles = vi.fn()
const removeAuth0Roles = vi.fn()

vi.mock("./management.server", () => ({
  updateAuth0User: (...a: unknown[]) => updateAuth0User(...a),
  listAuth0Roles: (...a: unknown[]) => listAuth0Roles(...a),
  getAuth0UserRoles: (...a: unknown[]) => getAuth0UserRoles(...a),
  assignAuth0Roles: (...a: unknown[]) => assignAuth0Roles(...a),
  removeAuth0Roles: (...a: unknown[]) => removeAuth0Roles(...a),
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

const name = { intent: "name" as const, firstName: "New", lastName: "Name" }

beforeEach(() => {
  vi.clearAllMocks()
  updateMany.mockResolvedValue({ count: 1 })
  updateAuth0User.mockResolvedValue({ ok: true, data: {} })
  listAuth0Roles.mockResolvedValue({
    ok: true,
    data: [
      { id: "rol_display", name: "Display" },
      { id: "rol_editor", name: "Student / Editor" },
      { id: "rol_super", name: "Superadmin" },
    ],
  })
  getAuth0UserRoles.mockResolvedValue({ ok: true, data: [] })
  assignAuth0Roles.mockResolvedValue({ ok: true, data: undefined })
  removeAuth0Roles.mockResolvedValue({ ok: true, data: undefined })
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

const role = (r: string) => ({ intent: "role" as const, role: r as never })

describe("changeUserRole", () => {
  it("removes what they hold and assigns the new one", async () => {
    getAuth0UserRoles.mockResolvedValue({
      ok: true,
      data: [{ id: "rol_display", name: "Display" }],
    })

    const result = await changeUserRole(person(), role("Superadmin"))

    expect(result.ok).toBe(true)
    expect(removeAuth0Roles).toHaveBeenCalledWith("auth0|1", ["rol_display"])
    expect(assignAuth0Roles).toHaveBeenCalledWith("auth0|1", ["rol_super"])
  })

  it("removes in front of assigning, so a half-failure grants nothing extra", async () => {
    getAuth0UserRoles.mockResolvedValue({
      ok: true,
      data: [{ id: "rol_display", name: "Display" }],
    })

    await changeUserRole(person(), role("Superadmin"))

    expect(removeAuth0Roles.mock.invocationCallOrder[0]).toBeLessThan(
      assignAuth0Roles.mock.invocationCallOrder[0]
    )
  })

  it("applies to every Auth0 account on the address", async () => {
    // A role set on one of two unlinked accounts leaves their permissions
    // depending on which one they sign in with.
    await changeUserRole(
      person({
        auth0Accounts: [
          account("auth0|1"),
          account("google-oauth2|2", "google-oauth2"),
        ],
      }),
      role("Superadmin")
    )

    expect(assignAuth0Roles).toHaveBeenCalledTimes(2)
  })

  it("removes their role and assigns nothing when set to no role", async () => {
    getAuth0UserRoles.mockResolvedValue({
      ok: true,
      data: [{ id: "rol_super", name: "Superadmin" }],
    })

    const result = await changeUserRole(person(), role("none"))

    expect(result.ok).toBe(true)
    expect(removeAuth0Roles).toHaveBeenCalledWith("auth0|1", ["rol_super"])
    expect(assignAuth0Roles).not.toHaveBeenCalled()
  })

  it("removes a role the application does not recognise", async () => {
    // The directory filters unknown role names out, so the roles on screen
    // are not the whole truth. Auth0 is asked instead.
    getAuth0UserRoles.mockResolvedValue({
      ok: true,
      data: [{ id: "rol_mystery", name: "Something Else" }],
    })

    await changeUserRole(person(), role("Display"))

    expect(removeAuth0Roles).toHaveBeenCalledWith("auth0|1", ["rol_mystery"])
  })

  it("does nothing when they already hold the role", async () => {
    getAuth0UserRoles.mockResolvedValue({
      ok: true,
      data: [{ id: "rol_super", name: "Superadmin" }],
    })

    const result = await changeUserRole(person(), role("Superadmin"))

    expect(result.ok).toBe(true)
    expect(removeAuth0Roles).not.toHaveBeenCalled()
    expect(assignAuth0Roles).not.toHaveBeenCalled()
  })

  it("changes nothing when the roles cannot be read from Auth0", async () => {
    listAuth0Roles.mockResolvedValue({
      ok: false,
      error: { kind: "network", message: "timeout" },
    })

    const result = await changeUserRole(person(), role("Superadmin"))

    expect(result.ok).toBe(false)
    expect(removeAuth0Roles).not.toHaveBeenCalled()
  })

  it("says plainly when the new role could not be assigned after the old was removed", async () => {
    getAuth0UserRoles.mockResolvedValue({
      ok: true,
      data: [{ id: "rol_display", name: "Display" }],
    })
    assignAuth0Roles.mockResolvedValue({
      ok: false,
      error: { kind: "api", message: "nope" },
    })

    const result = await changeUserRole(person(), role("Superadmin"))

    expect(result.ok).toBe(false)
    expect(result.warnings[0]).toContain("hold no role until this is set again")
  })

  it("refuses for someone with no Auth0 account", async () => {
    const result = await changeUserRole(
      person({ auth0Accounts: [] }),
      role("Display")
    )

    expect(result.ok).toBe(false)
    expect(result.warnings[0]).toContain("no Auth0 account")
  })
})

const active = (value: boolean) => ({
  intent: "active" as const,
  active: value,
})

describe("setUserActive", () => {
  it("blocks every Auth0 account and marks the local record inactive", async () => {
    const result = await setUserActive(
      person({
        auth0Accounts: [
          account("auth0|1"),
          account("google-oauth2|2", "google-oauth2"),
        ],
      }),
      active(false)
    )

    expect(result.ok).toBe(true)
    expect(updateAuth0User).toHaveBeenCalledWith("auth0|1", { blocked: true })
    expect(updateAuth0User).toHaveBeenCalledWith("google-oauth2|2", {
      blocked: true,
    })
    expect(updateMany).toHaveBeenCalledWith({
      where: { id: { in: [4] } },
      data: { is_active: 0 },
    })
  })

  it("unblocks and marks active again", async () => {
    const result = await setUserActive(person(), active(true))

    expect(result.ok).toBe(true)
    expect(updateAuth0User).toHaveBeenCalledWith("auth0|1", { blocked: false })
    expect(updateMany).toHaveBeenCalledWith(
      expect.objectContaining({ data: { is_active: 1 } })
    )
  })

  it("says they can still sign in when an account could not be blocked", async () => {
    // Blocking one of two accounts and reporting success would be worse than
    // useless: the person is described as stopped and is not.
    updateAuth0User.mockResolvedValue({
      ok: false,
      error: { kind: "api", message: "nope" },
    })

    const result = await setUserActive(person(), active(false))

    expect(result.warnings[0]).toContain("can still sign in")
  })

  it("blocks the accounts it can when one of two fails", async () => {
    updateAuth0User
      .mockResolvedValueOnce({ ok: true, data: {} })
      .mockResolvedValueOnce({
        ok: false,
        error: { kind: "api", message: "nope" },
      })

    const result = await setUserActive(
      person({
        auth0Accounts: [
          account("auth0|1"),
          account("google-oauth2|2", "google-oauth2"),
        ],
      }),
      active(false)
    )

    expect(result.ok).toBe(true)
    expect(result.warnings).toHaveLength(1)
  })

  it("says plainly that there was no sign-in to stop for a legacy contributor", async () => {
    const result = await setUserActive(
      person({ auth0Accounts: [] }),
      active(false)
    )

    expect(result.warnings.at(-1)).toContain("no Auth0 account")
  })
})
