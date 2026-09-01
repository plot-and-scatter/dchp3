// @vitest-environment node
import { createUser } from "./createUser.server"
import { UserActionEnum, type CreateUserInput } from "~/models/user.schemas"

// Creating a user is four calls that can each fail on their own, and Auth0 has
// no transaction across them. What these tests mostly pin is the line between
// "nothing was created" and "the account exists but something after it did
// not" -- reporting the second as a failure would leave an administrator
// creating the account twice.

const findAuth0UsersByEmail = vi.fn()
const listAuth0Roles = vi.fn()
const createAuth0User = vi.fn()
const assignAuth0Roles = vi.fn()
const createPasswordChangeTicket = vi.fn()
const getUserByEmailSafe = vi.fn()
const prismaUserCreate = vi.fn()

vi.mock("./management.server", () => ({
  findAuth0UsersByEmail: (...a: unknown[]) => findAuth0UsersByEmail(...a),
  listAuth0Roles: (...a: unknown[]) => listAuth0Roles(...a),
  createAuth0User: (...a: unknown[]) => createAuth0User(...a),
  assignAuth0Roles: (...a: unknown[]) => assignAuth0Roles(...a),
  createPasswordChangeTicket: (...a: unknown[]) =>
    createPasswordChangeTicket(...a),
}))
vi.mock("~/models/user.server", () => ({
  getUserByEmailSafe: (...a: unknown[]) => getUserByEmailSafe(...a),
}))
vi.mock("~/db.server", () => ({
  prisma: { user: { create: (...a: unknown[]) => prismaUserCreate(...a) } },
}))

const ok = <T>(data: T) => ({ ok: true as const, data })
const fail = (message: string) => ({
  ok: false as const,
  error: { kind: "api" as const, message },
})

const input = (overrides: Partial<CreateUserInput> = {}): CreateUserInput => ({
  userAction: UserActionEnum.CREATE_USER,
  email: "new@example.com",
  firstName: "New",
  lastName: "Person",
  role: "Student / Editor",
  ...overrides,
})

beforeEach(() => {
  vi.clearAllMocks()
  findAuth0UsersByEmail.mockResolvedValue(ok([]))
  getUserByEmailSafe.mockResolvedValue(null)
  listAuth0Roles.mockResolvedValue(
    ok([
      { id: "rol_editor", name: "Student / Editor" },
      { id: "rol_super", name: "Superadmin" },
    ])
  )
  createAuth0User.mockResolvedValue(ok({ user_id: "auth0|new" }))
  assignAuth0Roles.mockResolvedValue(ok(undefined))
  prismaUserCreate.mockResolvedValue({ id: 1 })
  createPasswordChangeTicket.mockResolvedValue(
    ok({ ticket: "https://tenant.auth0.com/lo/reset?t=abc" })
  )
})

describe("the happy path", () => {
  it("creates the account, assigns the role, writes the row, returns the link", async () => {
    const result = await createUser(input())

    expect(result).toEqual({
      ok: true,
      auth0UserId: "auth0|new",
      ticketUrl: "https://tenant.auth0.com/lo/reset?t=abc",
      warnings: [],
    })
    expect(assignAuth0Roles).toHaveBeenCalledWith("auth0|new", ["rol_editor"])
    expect(prismaUserCreate).toHaveBeenCalledWith({
      data: {
        email: "new@example.com",
        first_name: "New",
        last_name: "Person",
        is_active: 1,
      },
    })
  })

  it("sends Auth0 the name, so the list does not fall back to the address", async () => {
    await createUser(input())

    expect(createAuth0User).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "new@example.com",
        name: "New Person",
        given_name: "New",
        family_name: "Person",
      })
    )
  })

  it("never sends a password anyone could know", async () => {
    await createUser(input())

    const { password } = createAuth0User.mock.calls[0][0]
    expect(password).toEqual(expect.any(String))
    expect(password.length).toBeGreaterThan(20)
    // Two creations must not produce the same one.
    await createUser(input({ email: "other@example.com" }))
    expect(createAuth0User.mock.calls[1][0].password).not.toBe(password)
  })

  it("assigns no role, and asks Auth0 for none, when created without one", async () => {
    const result = await createUser(input({ role: "none" }))

    expect(result.ok).toBe(true)
    expect(listAuth0Roles).not.toHaveBeenCalled()
    expect(assignAuth0Roles).not.toHaveBeenCalled()
  })
})

describe("refusing before anything is created", () => {
  it("refuses an address Auth0 already knows, naming the connection", async () => {
    findAuth0UsersByEmail.mockResolvedValue(
      ok([
        {
          user_id: "google-oauth2|1",
          identities: [{ connection: "google-oauth2" }],
        },
      ])
    )

    const result = await createUser(input())

    expect(result.ok).toBe(false)
    expect(!result.ok && result.kind).toBe("duplicate")
    expect(!result.ok && result.message).toContain("google-oauth2")
    expect(createAuth0User).not.toHaveBeenCalled()
  })

  it("refuses an address only the local database knows", async () => {
    getUserByEmailSafe.mockResolvedValue({ id: 7 })

    const result = await createUser(input())

    expect(!result.ok && result.kind).toBe("duplicate")
    expect(createAuth0User).not.toHaveBeenCalled()
  })

  it("creates nothing when Auth0 cannot be asked about the address", async () => {
    findAuth0UsersByEmail.mockResolvedValue(fail("timeout"))

    const result = await createUser(input())

    expect(!result.ok && result.kind).toBe("failed")
    expect(createAuth0User).not.toHaveBeenCalled()
  })

  it("creates nothing when the named role does not exist in the tenant", async () => {
    listAuth0Roles.mockResolvedValue(ok([{ id: "rol_x", name: "Something" }]))

    const result = await createUser(input())

    expect(!result.ok && result.message).toContain("no role named")
    expect(createAuth0User).not.toHaveBeenCalled()
  })

  it("reports Auth0 refusing the creation as a failure", async () => {
    createAuth0User.mockResolvedValue(fail("PasswordStrengthError"))

    const result = await createUser(input())

    expect(!result.ok && result.kind).toBe("failed")
    expect(!result.ok && result.message).toContain("nothing was created")
  })
})

describe("when the account exists but a later step does not", () => {
  it("still succeeds when the role assignment fails, and says so", async () => {
    assignAuth0Roles.mockResolvedValue(fail("insufficient scope"))

    const result = await createUser(input())

    // Reporting failure here would have an administrator create the account a
    // second time.
    expect(result.ok).toBe(true)
    expect(result.ok && result.warnings).toHaveLength(1)
    expect(result.ok && result.warnings[0]).toContain("Set it from the list")
  })

  it("still succeeds when the local row cannot be written", async () => {
    prismaUserCreate.mockRejectedValue(new Error("connection lost"))

    const result = await createUser(input())

    expect(result.ok).toBe(true)
    expect(result.ok && result.warnings[0]).toContain("first sign in")
  })

  it("still succeeds when the password link cannot be made", async () => {
    createPasswordChangeTicket.mockResolvedValue(fail("rate limited"))

    const result = await createUser(input())

    expect(result.ok).toBe(true)
    expect(result.ok && result.ticketUrl).toBeNull()
    expect(result.ok && result.warnings[0]).toContain("password reset")
  })

  it("collects every warning rather than stopping at the first", async () => {
    assignAuth0Roles.mockResolvedValue(fail("a"))
    prismaUserCreate.mockRejectedValue(new Error("b"))
    createPasswordChangeTicket.mockResolvedValue(fail("c"))

    const result = await createUser(input())

    expect(result.ok && result.warnings).toHaveLength(3)
  })
})
