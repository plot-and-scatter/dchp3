// @vitest-environment node
import {
  ensureLocalUserForLogin,
  USER_DISPLAY_SELECT,
  getAllUsers,
  getUserByEmailSafe,
  getUserIdByEmailOrThrow,
} from "./user.server"

// These functions feed loader data, which React Router serialises into the
// page. The `user` table also holds the pre-Auth0 login columns and several
// legacy flags, and no page reads any of them, so the queries name their
// columns rather than taking the whole row. These tests pin the column list
// that goes to the browser -- adding a column to the select should be a
// deliberate act that fails a test first.

const findMany = vi.fn()
const findFirst = vi.fn()
const findFirstOrThrow = vi.fn()
const create = vi.fn()
const update = vi.fn()

vi.mock("~/db.server", () => ({
  prisma: {
    user: {
      findMany: (...args: unknown[]) => findMany(...args),
      findFirst: (...args: unknown[]) => findFirst(...args),
      findFirstOrThrow: (...args: unknown[]) => findFirstOrThrow(...args),
      create: (...args: unknown[]) => create(...args),
      update: (...args: unknown[]) => update(...args),
    },
  },
}))

beforeEach(() => vi.clearAllMocks())

const EXPECTED_COLUMNS = [
  "id",
  "email",
  "first_name",
  "last_name",
  "is_active",
  "access_level",
]

describe("USER_DISPLAY_SELECT", () => {
  it("names exactly the columns the pages display", () => {
    expect(Object.keys(USER_DISPLAY_SELECT).sort()).toEqual(
      [...EXPECTED_COLUMNS].sort()
    )
  })

  it("selects no credential or legacy column", () => {
    const keys = Object.keys(USER_DISPLAY_SELECT)
    ;[
      "password",
      "password_key",
      "student_id",
      "course",
      "is_dchp1",
      "is_proofer",
      "is_teach",
    ].forEach((column) => expect(keys).not.toContain(column))
  })

  it("asks for every named column rather than excluding any", () => {
    Object.values(USER_DISPLAY_SELECT).forEach((value) =>
      expect(value).toBe(true)
    )
  })
})

describe("getAllUsers", () => {
  it("passes the select to Prisma alongside the existing email filter", async () => {
    findMany.mockResolvedValue([])
    await getAllUsers()

    expect(findMany).toHaveBeenCalledWith({
      where: { NOT: [{ email: null }] },
      select: USER_DISPLAY_SELECT,
    })
  })
})

describe("getUserByEmailSafe", () => {
  it("passes the select to Prisma", async () => {
    findFirst.mockResolvedValue(null)
    await getUserByEmailSafe({ email: "someone@example.com" })

    expect(findFirst).toHaveBeenCalledWith({
      where: { email: "someone@example.com" },
      select: USER_DISPLAY_SELECT,
    })
  })
})

describe("getUserIdByEmailOrThrow", () => {
  it("asks for the id alone rather than reading a row and discarding it", async () => {
    findFirstOrThrow.mockResolvedValue({ id: 7 })

    await expect(
      getUserIdByEmailOrThrow({ email: "someone@example.com" })
    ).resolves.toBe(7)

    expect(findFirstOrThrow).toHaveBeenCalledWith({
      where: { email: "someone@example.com" },
      select: { id: true },
    })
  })
})

describe("ensureLocalUserForLogin", () => {
  const signIn = () =>
    ensureLocalUserForLogin({
      email: "someone@example.com",
      firstName: "Some",
      lastName: "One",
    })

  it("creates a row for someone who has none, marked active", () => {
    findFirst.mockResolvedValue(null)
    create.mockResolvedValue({ id: 1 })

    return signIn().then(() => {
      expect(create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ is_active: 1 }),
        })
      )
    })
  })

  it("leaves an existing row exactly as it is", async () => {
    // This is the whole point. is_active used to be written on every login,
    // so deactivating someone was undone the next time they signed in, and
    // the flag could only ever mean "has signed in at some point".
    findFirst.mockResolvedValue({ id: 4, is_active: 0 })

    const user = await signIn()

    expect(user).toEqual({ id: 4, is_active: 0 })
    expect(update).not.toHaveBeenCalled()
    expect(create).not.toHaveBeenCalled()
  })

  it("does not reactivate someone who has been deactivated", async () => {
    findFirst.mockResolvedValue({ id: 4, is_active: 0 })

    const user = await signIn()

    expect(user.is_active).toBe(0)
  })
})
