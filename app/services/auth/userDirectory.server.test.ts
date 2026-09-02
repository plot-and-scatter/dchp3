// @vitest-environment node
import {
  auth0UserIdsFor,
  getDirectoryUserByEmail,
  getUserDirectory,
  isPartiallyBlocked,
} from "./userDirectory.server"
import type { DisplayUser } from "~/models/user.server"

// The two sources do not agree, and the point of the directory is to show the
// disagreement rather than hide it. These tests pin each of the three join
// states, the case-insensitive match, the duplicate-email case that exists in
// production, and what the page gets when Auth0 cannot be read.

const getAllUsers = vi.fn()
const getContributionCountsByUserId = vi.fn()
const listAllAuth0Users = vi.fn()
const listAuth0Roles = vi.fn()
const listAuth0RoleMembers = vi.fn()

vi.mock("~/db.server", () => ({ prisma: {} }))
vi.mock("~/models/user.server", () => ({
  getAllUsers: () => getAllUsers(),
  getContributionCountsByUserId: () => getContributionCountsByUserId(),
}))
const findAuth0UsersByEmail = vi.fn()
const getAuth0UserRoles = vi.fn()

vi.mock("./management.server", () => ({
  listAllAuth0Users: () => listAllAuth0Users(),
  listAuth0Roles: () => listAuth0Roles(),
  listAuth0RoleMembers: (id: string) => listAuth0RoleMembers(id),
  findAuth0UsersByEmail: (email: string) => findAuth0UsersByEmail(email),
  getAuth0UserRoles: (id: string) => getAuth0UserRoles(id),
}))

const localRow = (overrides: Partial<DisplayUser> = {}): DisplayUser =>
  ({
    id: 1,
    email: "someone@example.com",
    first_name: "Some",
    last_name: "One",
    is_active: 1,
    access_level: 3,
    ...overrides,
  } as DisplayUser)

const ok = <T>(data: T) => ({ ok: true as const, data })
const fail = (message: string) => ({
  ok: false as const,
  error: { kind: "network" as const, message },
})

beforeEach(() => {
  vi.clearAllMocks()
  getAllUsers.mockResolvedValue([])
  getContributionCountsByUserId.mockResolvedValue(new Map())
  listAllAuth0Users.mockResolvedValue(ok([]))
  listAuth0Roles.mockResolvedValue(ok([]))
  listAuth0RoleMembers.mockResolvedValue(ok([]))
  findAuth0UsersByEmail.mockResolvedValue(ok([]))
  getAuth0UserRoles.mockResolvedValue(ok([]))
})

describe("the three join states", () => {
  it("marks a person in both systems as both", async () => {
    getAllUsers.mockResolvedValue([localRow({ email: "both@example.com" })])
    listAllAuth0Users.mockResolvedValue(
      ok([{ user_id: "auth0|1", email: "both@example.com", name: "Both User" }])
    )

    const { users } = await getUserDirectory()

    expect(users).toHaveLength(1)
    expect(users[0].presence).toBe("both")
    expect(users[0].name).toBe("Both User")
    expect(users[0].localRows).toHaveLength(1)
  })

  it("marks an Auth0 account with no local row as auth0Only", async () => {
    listAllAuth0Users.mockResolvedValue(
      ok([
        {
          user_id: "auth0|2",
          email: "new@example.com",
          name: "Never Logged In",
        },
      ])
    )

    const { users } = await getUserDirectory()

    expect(users[0].presence).toBe("auth0Only")
    expect(users[0].localRows).toEqual([])
  })

  it("marks a local row with no Auth0 account as localOnly", async () => {
    getAllUsers.mockResolvedValue([
      localRow({
        id: 9,
        email: "old@example.com",
        first_name: "Old",
        last_name: "Hand",
      }),
    ])

    const { users } = await getUserDirectory()

    expect(users[0].presence).toBe("localOnly")
    expect(users[0].name).toBe("Old Hand")
    expect(users[0].auth0Accounts).toEqual([])
    expect(users[0].roles).toEqual([])
  })

  it("shows all three at once", async () => {
    getAllUsers.mockResolvedValue([
      localRow({ id: 1, email: "both@example.com" }),
      localRow({ id: 2, email: "local@example.com" }),
    ])
    listAllAuth0Users.mockResolvedValue(
      ok([
        { user_id: "auth0|1", email: "both@example.com" },
        { user_id: "auth0|2", email: "auth0@example.com" },
      ])
    )

    const { users } = await getUserDirectory()

    expect(Object.fromEntries(users.map((u) => [u.email, u.presence]))).toEqual(
      {
        "auth0@example.com": "auth0Only",
        "both@example.com": "both",
        "local@example.com": "localOnly",
      }
    )
  })
})

describe("which name is shown", () => {
  it("prefers a real name from Auth0", async () => {
    getAllUsers.mockResolvedValue([
      localRow({
        email: "a@example.com",
        first_name: "Local",
        last_name: "Name",
      }),
    ])
    listAllAuth0Users.mockResolvedValue(
      ok([{ user_id: "auth0|1", email: "a@example.com", name: "Auth0 Name" }])
    )

    const { users } = await getUserDirectory()
    expect(users[0].name).toBe("Auth0 Name")
  })

  it("ignores an Auth0 name that is only the email address", async () => {
    // Auth0 sets name to the address when an account is created without one,
    // which is true of most accounts in this tenant. Preferring it put an
    // address where a name belongs.
    getAllUsers.mockResolvedValue([
      localRow({
        email: "a@example.com",
        first_name: "Real",
        last_name: "Person",
      }),
    ])
    listAllAuth0Users.mockResolvedValue(
      ok([
        { user_id: "auth0|1", email: "a@example.com", name: "a@example.com" },
      ])
    )

    const { users } = await getUserDirectory()
    expect(users[0].name).toBe("Real Person")
  })

  it("falls back to the address when neither side has a name", async () => {
    listAllAuth0Users.mockResolvedValue(
      ok([
        { user_id: "auth0|1", email: "a@example.com", name: "a@example.com" },
      ])
    )

    const { users } = await getUserDirectory()
    expect(users[0].name).toBe("a@example.com")
  })
})

describe("matching", () => {
  it("joins on email case-insensitively and ignores surrounding space", async () => {
    getAllUsers.mockResolvedValue([
      localRow({ email: "  Mixed.Case@Example.COM " }),
    ])
    listAllAuth0Users.mockResolvedValue(
      ok([{ user_id: "auth0|1", email: "mixed.case@example.com" }])
    )

    const { users } = await getUserDirectory()

    expect(users).toHaveLength(1)
    expect(users[0].presence).toBe("both")
    expect(users[0].email).toBe("mixed.case@example.com")
  })

  it("keeps every local row when several share an address", async () => {
    // The user table has no unique index on email despite @@unique in
    // schema.prisma, and production does contain duplicates.
    getAllUsers.mockResolvedValue([
      localRow({ id: 1, email: "dupe@example.com" }),
      localRow({ id: 2, email: "DUPE@example.com" }),
    ])
    listAllAuth0Users.mockResolvedValue(
      ok([{ user_id: "auth0|1", email: "dupe@example.com" }])
    )

    const { users } = await getUserDirectory()

    expect(users).toHaveLength(1)
    expect(users[0].localRows.map((r) => r.id)).toEqual([1, 2])
  })

  it("groups two unlinked Auth0 accounts on one address into one person", async () => {
    // The tenant has never used Auth0 account linking, so a person who has
    // signed in both ways has two accounts. They are one person, and the two
    // accounts can hold different roles and be blocked separately.
    getAllUsers.mockResolvedValue([localRow({ email: "two@example.com" })])
    listAllAuth0Users.mockResolvedValue(
      ok([
        {
          user_id: "auth0|1",
          email: "two@example.com",
          identities: [{ connection: "Username-Password-Authentication" }],
        },
        {
          user_id: "google-oauth2|2",
          email: "TWO@example.com",
          blocked: true,
          identities: [{ connection: "google-oauth2" }],
        },
      ])
    )

    const { users } = await getUserDirectory()

    expect(users).toHaveLength(1)
    expect(users[0].auth0Accounts.map((a) => a.userId)).toEqual([
      "auth0|1",
      "google-oauth2|2",
    ])
    expect(users[0].auth0Accounts.map((a) => a.connection)).toEqual([
      "Username-Password-Authentication",
      "google-oauth2",
    ])
    expect(users[0].presence).toBe("both")
  })

  it("unions the roles held across a person's Auth0 accounts", async () => {
    listAllAuth0Users.mockResolvedValue(
      ok([
        { user_id: "auth0|1", email: "two@example.com" },
        { user_id: "google-oauth2|2", email: "two@example.com" },
      ])
    )
    listAuth0Roles.mockResolvedValue(
      ok([
        { id: "rol_super", name: "Superadmin" },
        { id: "rol_display", name: "Display" },
      ])
    )
    listAuth0RoleMembers.mockImplementation((id: string) =>
      Promise.resolve(
        ok(
          id === "rol_super"
            ? [{ user_id: "auth0|1" }]
            : [{ user_id: "google-oauth2|2" }]
        )
      )
    )

    const { users } = await getUserDirectory()

    expect(users[0].roles.sort()).toEqual(["Display", "Superadmin"])
  })

  it("keeps a local row that has no email at all", async () => {
    getAllUsers.mockResolvedValue([
      localRow({ id: 5, email: null, first_name: "No", last_name: "Address" }),
    ])

    const { users } = await getUserDirectory()

    expect(users[0].email).toBeNull()
    expect(users[0].presence).toBe("localOnly")
    expect(users[0].name).toBe("No Address")
  })
})

describe("acting on every account a person holds", () => {
  const twoAccounts = () => {
    listAllAuth0Users.mockResolvedValue(
      ok([
        { user_id: "auth0|1", email: "two@example.com" },
        { user_id: "google-oauth2|2", email: "two@example.com", blocked: true },
      ])
    )
  }

  it("lists every account id, so a change can be applied to all of them", async () => {
    twoAccounts()
    const { users } = await getUserDirectory()

    // #444 and #445 change one account at a time; applied to only one, the
    // person keeps the old role or keeps logging in through the other.
    expect(auth0UserIdsFor(users[0])).toEqual(["auth0|1", "google-oauth2|2"])
  })

  it("reports a person whose accounts are only partly blocked", async () => {
    twoAccounts()
    const { users } = await getUserDirectory()

    expect(isPartiallyBlocked(users[0])).toBe(true)
  })

  it("is not partly blocked when every account is blocked", async () => {
    listAllAuth0Users.mockResolvedValue(
      ok([
        { user_id: "auth0|1", email: "two@example.com", blocked: true },
        { user_id: "google-oauth2|2", email: "two@example.com", blocked: true },
      ])
    )
    const { users } = await getUserDirectory()

    expect(isPartiallyBlocked(users[0])).toBe(false)
  })

  it("is not partly blocked when there is only one account", async () => {
    listAllAuth0Users.mockResolvedValue(
      ok([{ user_id: "auth0|1", email: "one@example.com", blocked: true }])
    )
    const { users } = await getUserDirectory()

    expect(isPartiallyBlocked(users[0])).toBe(false)
  })
})

describe("roles", () => {
  it("attaches roles read per role rather than per user", async () => {
    listAllAuth0Users.mockResolvedValue(
      ok([
        { user_id: "auth0|1", email: "admin@example.com" },
        { user_id: "auth0|2", email: "editor@example.com" },
      ])
    )
    listAuth0Roles.mockResolvedValue(
      ok([
        { id: "rol_super", name: "Superadmin" },
        { id: "rol_editor", name: "Student / Editor" },
      ])
    )
    listAuth0RoleMembers.mockImplementation((id: string) =>
      Promise.resolve(
        ok(
          id === "rol_super"
            ? [{ user_id: "auth0|1" }]
            : [{ user_id: "auth0|2" }]
        )
      )
    )

    const { users } = await getUserDirectory()

    expect(users.find((u) => u.email === "admin@example.com")?.roles).toEqual([
      "Superadmin",
    ])
    expect(users.find((u) => u.email === "editor@example.com")?.roles).toEqual([
      "Student / Editor",
    ])
    // Two roles, so two membership requests -- not one per user.
    expect(listAuth0RoleMembers).toHaveBeenCalledTimes(2)
  })

  it("skips a tenant role this application does not recognise", async () => {
    listAllAuth0Users.mockResolvedValue(
      ok([{ user_id: "auth0|1", email: "someone@example.com" }])
    )
    listAuth0Roles.mockResolvedValue(
      ok([
        { id: "rol_unknown", name: "Something Else" },
        { id: "rol_super", name: "Superadmin" },
      ])
    )
    listAuth0RoleMembers.mockResolvedValue(ok([{ user_id: "auth0|1" }]))

    const { users } = await getUserDirectory()

    // A role that grants nothing here would misrepresent what they can do.
    expect(users[0].roles).toEqual(["Superadmin"])
    expect(listAuth0RoleMembers).toHaveBeenCalledTimes(1)
  })
})

describe("contributions", () => {
  it("sums a person's entry edits and citations", async () => {
    getAllUsers.mockResolvedValue([localRow({ id: 4, email: "a@example.com" })])
    getContributionCountsByUserId.mockResolvedValue(
      new Map([[4, { edits: 800, citations: 65 }]])
    )
    listAllAuth0Users.mockResolvedValue(
      ok([{ user_id: "auth0|1", email: "a@example.com" }])
    )

    const { users } = await getUserDirectory()

    expect(users[0].contributions).toEqual({ edits: 800, citations: 65 })
  })

  it("adds up every local row when an address has more than one", async () => {
    getAllUsers.mockResolvedValue([
      localRow({ id: 1, email: "dupe@example.com" }),
      localRow({ id: 2, email: "dupe@example.com" }),
    ])
    getContributionCountsByUserId.mockResolvedValue(
      new Map([
        [1, { edits: 5, citations: 1 }],
        [2, { edits: 2, citations: 3 }],
      ])
    )

    const { users } = await getUserDirectory()

    expect(users[0].contributions).toEqual({ edits: 7, citations: 4 })
  })

  it("is zero for an Auth0 account with no local row", async () => {
    listAllAuth0Users.mockResolvedValue(
      ok([{ user_id: "auth0|1", email: "new@example.com" }])
    )

    const { users } = await getUserDirectory()

    expect(users[0].contributions).toEqual({ edits: 0, citations: 0 })
  })

  it("is still counted when Auth0 cannot be read", async () => {
    // The fallback list is the one an administrator acts on when Auth0 is
    // down, so it needs the same information.
    getAllUsers.mockResolvedValue([localRow({ id: 4, email: "a@example.com" })])
    getContributionCountsByUserId.mockResolvedValue(
      new Map([[4, { edits: 9, citations: 0 }]])
    )
    listAllAuth0Users.mockResolvedValue(fail("timeout"))

    const { users } = await getUserDirectory()

    expect(users[0].contributions).toEqual({ edits: 9, citations: 0 })
  })
})

describe("when Auth0 cannot be read", () => {
  it("still returns the local rows, with the error", async () => {
    getAllUsers.mockResolvedValue([
      localRow({ id: 1, email: "a@example.com" }),
      localRow({ id: 2, email: "b@example.com" }),
    ])
    listAllAuth0Users.mockResolvedValue(fail("getaddrinfo ENOTFOUND"))

    const { users, auth0Error } = await getUserDirectory()

    expect(users).toHaveLength(2)
    expect(auth0Error?.message).toContain("ENOTFOUND")
  })

  it("does not claim those people cannot log in", async () => {
    getAllUsers.mockResolvedValue([localRow({ email: "a@example.com" })])
    listAllAuth0Users.mockResolvedValue(fail("timeout"))

    const { users } = await getUserDirectory()

    // localOnly is a positive finding. Auth0 being unreachable is not one.
    expect(users[0].presence).toBe("auth0Unknown")
  })

  it("reports a failure to read roles the same way", async () => {
    getAllUsers.mockResolvedValue([localRow({ email: "a@example.com" })])
    listAllAuth0Users.mockResolvedValue(
      ok([{ user_id: "auth0|1", email: "a@example.com" }])
    )
    listAuth0Roles.mockResolvedValue(fail("rate limited"))

    const { users, auth0Error } = await getUserDirectory()

    expect(auth0Error?.message).toContain("rate limited")
    expect(users[0].presence).toBe("auth0Unknown")
  })

  it("returns no error when Auth0 answers", async () => {
    const { auth0Error } = await getUserDirectory()
    expect(auth0Error).toBeNull()
  })
})

describe("one person, read on their own", () => {
  it("asks Auth0 for that address rather than reading the whole list", async () => {
    // The list endpoint is backed by a search index that trails the user
    // store, so a page opened just after blocking somebody showed them as
    // still able to sign in. This lookup is exact and does not trail.
    findAuth0UsersByEmail.mockResolvedValue(
      ok([{ user_id: "auth0|1", email: "a@example.com", blocked: true }])
    )

    const { user } = await getDirectoryUserByEmail("a@example.com")

    expect(findAuth0UsersByEmail).toHaveBeenCalledWith("a@example.com")
    expect(listAllAuth0Users).not.toHaveBeenCalled()
    expect(user?.auth0Accounts[0].blocked).toBe(true)
  })

  it("reads their roles per account rather than per role in the tenant", async () => {
    findAuth0UsersByEmail.mockResolvedValue(
      ok([{ user_id: "auth0|1", email: "a@example.com" }])
    )
    getAuth0UserRoles.mockResolvedValue(ok([{ id: "r", name: "Superadmin" }]))

    const { user } = await getDirectoryUserByEmail("a@example.com")

    expect(user?.roles).toEqual(["Superadmin"])
    expect(listAuth0RoleMembers).not.toHaveBeenCalled()
  })

  it("lower-cases the address it is given", async () => {
    await getDirectoryUserByEmail("  A@Example.COM ")
    expect(findAuth0UsersByEmail).toHaveBeenCalledWith("a@example.com")
  })

  it("finds a legacy contributor who has no Auth0 account", async () => {
    getAllUsers.mockResolvedValue([localRow({ email: "old@example.com" })])

    const { user } = await getDirectoryUserByEmail("old@example.com")

    expect(user?.presence).toBe("localOnly")
  })

  it("finds nobody when neither system has the address", async () => {
    const { user } = await getDirectoryUserByEmail("nobody@example.com")
    expect(user).toBeNull()
  })

  it("claims nothing about their accounts when Auth0 cannot be asked", async () => {
    getAllUsers.mockResolvedValue([localRow({ email: "a@example.com" })])
    findAuth0UsersByEmail.mockResolvedValue(fail("timeout"))

    const { user, auth0Error } = await getDirectoryUserByEmail("a@example.com")

    expect(user?.presence).toBe("auth0Unknown")
    expect(auth0Error?.message).toContain("timeout")
  })

  it("counts their contributions", async () => {
    getAllUsers.mockResolvedValue([localRow({ id: 4, email: "a@example.com" })])
    getContributionCountsByUserId.mockResolvedValue(
      new Map([[4, { edits: 3, citations: 2 }]])
    )
    findAuth0UsersByEmail.mockResolvedValue(
      ok([{ user_id: "auth0|1", email: "a@example.com" }])
    )

    const { user } = await getDirectoryUserByEmail("a@example.com")

    expect(user?.contributions).toEqual({ edits: 3, citations: 2 })
  })
})
