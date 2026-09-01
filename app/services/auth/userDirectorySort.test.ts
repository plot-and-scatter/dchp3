// @vitest-environment node
import {
  ACCESS_FILTERS,
  DATABASE_CONNECTION,
  DEFAULT_ACCESS_FILTER,
  hasPassword,
  isAccessFilter,
  isFullyBlocked,
  isLegacyUser,
  isRoleFilter,
  isSortColumn,
  lastLoginAt,
  matchesAccessFilter,
  matchesRoleFilter,
  SORT_COLUMNS,
  sortDirectoryUsers,
  totalLogins,
  USER_DIRECTORY_PAGE_SIZE,
  type DirectoryUser,
} from "./userDirectory"

// Two of the columns sort by rank rather than alphabetically, so that
// ascending puts the rows worth looking at first. These tests pin that
// ordering, because it is a judgement rather than an obvious default.

const account = (
  overrides: Partial<DirectoryUser["auth0Accounts"][number]> = {}
) => ({
  userId: "auth0|1",
  connection: "Username-Password-Authentication",
  blocked: false,
  lastLogin: null,
  loginsCount: 0,
  roles: [],
  ...overrides,
})

const person = (overrides: Partial<DirectoryUser> = {}): DirectoryUser => ({
  email: "someone@example.com",
  name: "Some One",
  presence: "both",
  roles: [],
  auth0Accounts: [account()],
  localRows: [],
  contributions: { edits: 0, citations: 0 },
  ...overrides,
})

const namesOf = (users: DirectoryUser[]) => users.map((u) => u.name)

describe("isSortColumn", () => {
  it.each(SORT_COLUMNS)("accepts %s", (column) => {
    expect(isSortColumn(column)).toBe(true)
  })

  it.each([["createdAt"], [""], [null], [3]])("rejects %s", (value) => {
    expect(isSortColumn(value)).toBe(false)
  })
})

describe("sorting by name and email", () => {
  const people = [
    person({ name: "Zoe", email: "zoe@example.com" }),
    person({ name: "Adam", email: "adam@example.com" }),
    person({ name: "Émile", email: "emile@example.com" }),
  ]

  it("orders names alphabetically, accents included", () => {
    expect(namesOf(sortDirectoryUsers(people, "name", "asc"))).toEqual([
      "Adam",
      "Émile",
      "Zoe",
    ])
  })

  it("reverses on descending", () => {
    expect(namesOf(sortDirectoryUsers(people, "name", "desc"))).toEqual([
      "Zoe",
      "Émile",
      "Adam",
    ])
  })

  it("does not modify the array it was given", () => {
    const original = [...people]
    sortDirectoryUsers(people, "name", "desc")
    expect(people).toEqual(original)
  })

  it("holds a missing email at the end in both directions", () => {
    const withNull = [
      person({ name: "No Address", email: null }),
      person({ name: "Beta", email: "b@example.com" }),
      person({ name: "Alpha", email: "a@example.com" }),
    ]

    expect(namesOf(sortDirectoryUsers(withNull, "email", "asc")).at(-1)).toBe(
      "No Address"
    )
    // A row with no address is never what someone sorting by address wants,
    // whichever way round they sort.
    expect(namesOf(sortDirectoryUsers(withNull, "email", "desc")).at(-1)).toBe(
      "No Address"
    )
  })
})

describe("sorting by role puts the audit cases first", () => {
  const people = [
    person({ name: "Super", roles: ["Superadmin"] }),
    person({ name: "Nobody", roles: [] }),
    person({ name: "Editor", roles: ["Student / Editor"] }),
    person({
      name: "Local",
      roles: [],
      auth0Accounts: [],
      presence: "localOnly",
    }),
    person({ name: "Display", roles: ["Display"] }),
  ]

  it("leads with someone who can log in and holds no role", () => {
    // The case an audit is looking for: a self-service signup.
    expect(namesOf(sortDirectoryUsers(people, "role", "asc"))[0]).toBe("Nobody")
  })

  it("orders the rest by seniority and puts rows with no account last", () => {
    expect(namesOf(sortDirectoryUsers(people, "role", "asc"))).toEqual([
      "Nobody",
      "Display",
      "Editor",
      "Super",
      "Local",
    ])
  })

  it("ranks by the most senior role when someone holds two", () => {
    const two = [
      person({ name: "Both", roles: ["Display", "Superadmin"] }),
      person({ name: "Just Display", roles: ["Display"] }),
    ]
    expect(namesOf(sortDirectoryUsers(two, "role", "asc"))).toEqual([
      "Just Display",
      "Both",
    ])
  })
})

describe("sorting by contributions", () => {
  const people = [
    person({ name: "Prolific", contributions: { edits: 800, citations: 65 } }),
    person({ name: "Nothing", contributions: { edits: 0, citations: 0 } }),
    person({ name: "Some", contributions: { edits: 10, citations: 3 } }),
  ]

  it("sums entry edits and citations", () => {
    expect(
      namesOf(sortDirectoryUsers(people, "contributions", "desc"))
    ).toEqual(["Prolific", "Some", "Nothing"])
  })

  it("groups the accounts that did nothing when ascending", () => {
    // The pairing that makes "holds no role" actionable: no role AND no work
    // is a signup to remove; no role but a great deal of work is a
    // contributor whose role went missing.
    expect(namesOf(sortDirectoryUsers(people, "contributions", "asc"))[0]).toBe(
      "Nothing"
    )
  })
})

describe("sorting by login puts the problems first", () => {
  const people = [
    person({ name: "Fine" }),
    person({ name: "Unknown", presence: "auth0Unknown", auth0Accounts: [] }),
    person({ name: "NoLogin", presence: "localOnly", auth0Accounts: [] }),
    person({
      name: "Blocked",
      auth0Accounts: [account({ blocked: true })],
    }),
    person({
      name: "Partly",
      auth0Accounts: [
        account({ userId: "auth0|1", blocked: true }),
        account({ userId: "auth0|2", blocked: false }),
      ],
    }),
  ]

  it("leads with the person who is blocked but can still log in", () => {
    expect(namesOf(sortDirectoryUsers(people, "login", "asc"))).toEqual([
      "Partly",
      "Blocked",
      "NoLogin",
      "Unknown",
      "Fine",
    ])
  })
})

describe("stability", () => {
  it("falls back to the name when a column ties, so paging does not shuffle", () => {
    // Everyone here ranks the same on login, so the order must come from the
    // name rather than from whatever order Auth0 returned.
    const tied = [
      person({ name: "Charlie" }),
      person({ name: "Alice" }),
      person({ name: "Bob" }),
    ]
    expect(namesOf(sortDirectoryUsers(tied, "login", "asc"))).toEqual([
      "Alice",
      "Bob",
      "Charlie",
    ])
  })
})

describe("page size", () => {
  it("is a round number that fits a screen", () => {
    expect(USER_DIRECTORY_PAGE_SIZE).toBe(25)
  })
})

describe("isLegacyUser", () => {
  it("is true for someone with a local row and no Auth0 account", () => {
    expect(
      isLegacyUser(person({ presence: "localOnly", auth0Accounts: [] }))
    ).toBe(true)
  })

  it("is false for someone who has an Auth0 account", () => {
    expect(isLegacyUser(person({ presence: "both" }))).toBe(false)
    expect(isLegacyUser(person({ presence: "auth0Only", localRows: [] }))).toBe(
      false
    )
  })

  it("is false when Auth0 could not be read", () => {
    // Nobody can be called legacy on the strength of a question that was
    // never asked: the absence of an account is the only evidence there is,
    // and an unread Auth0 is not absence.
    expect(
      isLegacyUser(person({ presence: "auth0Unknown", auth0Accounts: [] }))
    ).toBe(false)
  })
})

describe("isFullyBlocked", () => {
  const blocked = (...flags: boolean[]) =>
    person({
      auth0Accounts: flags.map((b, i) =>
        account({ userId: `auth0|${i}`, blocked: b })
      ),
    })

  it("is true when every account is blocked", () => {
    expect(isFullyBlocked(blocked(true))).toBe(true)
    expect(isFullyBlocked(blocked(true, true))).toBe(true)
  })

  it("is false when only some are blocked", () => {
    // They can still log in through the other account, which is why the list
    // must not hide them as blocked.
    expect(isFullyBlocked(blocked(true, false))).toBe(false)
  })

  it("is false for someone with no Auth0 account at all", () => {
    // A legacy contributor has not been blocked; they never had an account.
    expect(
      isFullyBlocked(person({ presence: "localOnly", auth0Accounts: [] }))
    ).toBe(false)
  })

  it("does not overlap with isLegacyUser", () => {
    const legacy = person({ presence: "localOnly", auth0Accounts: [] })
    expect(isLegacyUser(legacy) && isFullyBlocked(legacy)).toBe(false)
  })
})

describe("last login", () => {
  const withLogins = (...logins: [string | null, number][]) =>
    person({
      auth0Accounts: logins.map(([at, count], i) =>
        account({ userId: `auth0|${i}`, lastLogin: at, loginsCount: count })
      ),
    })

  it("takes the most recent across a person's accounts", () => {
    // Someone with a database account and a Google one has two dates, and the
    // question is when they were last here, not when each account was.
    const user = withLogins(
      ["2026-08-23T10:00:00.000Z", 29],
      ["2026-08-28T09:00:00.000Z", 2]
    )
    expect(lastLoginAt(user)).toBe("2026-08-28T09:00:00.000Z")
  })

  it("sums the sign-in counts across accounts", () => {
    expect(
      totalLogins(withLogins(["2026-01-01T00:00:00.000Z", 29], [null, 2]))
    ).toBe(31)
  })

  it("is null when no account has ever been used", () => {
    expect(lastLoginAt(withLogins([null, 0]))).toBeNull()
  })

  it("is null for someone with no Auth0 account", () => {
    expect(
      lastLoginAt(person({ presence: "localOnly", auth0Accounts: [] }))
    ).toBeNull()
  })

  it("sorts oldest first, holding never-signed-in at the end both ways", () => {
    const people = [
      person({
        name: "Recent",
        auth0Accounts: [account({ lastLogin: "2026-08-28T00:00:00.000Z" })],
      }),
      person({ name: "Never", auth0Accounts: [account({ lastLogin: null })] }),
      person({
        name: "Old",
        auth0Accounts: [account({ lastLogin: "2023-07-18T00:00:00.000Z" })],
      }),
    ]

    expect(namesOf(sortDirectoryUsers(people, "lastLogin", "asc"))).toEqual([
      "Old",
      "Recent",
      "Never",
    ])
    expect(namesOf(sortDirectoryUsers(people, "lastLogin", "desc"))).toEqual([
      "Recent",
      "Old",
      "Never",
    ])
  })
})

describe("the access filter", () => {
  const canLogIn = person({ auth0Accounts: [account({ blocked: false })] })
  const blocked = person({ auth0Accounts: [account({ blocked: true })] })
  const partly = person({
    auth0Accounts: [
      account({ userId: "auth0|1", blocked: true }),
      account({ userId: "auth0|2", blocked: false }),
    ],
  })
  const legacy = person({ presence: "localOnly", auth0Accounts: [] })
  const unknown = person({ presence: "auth0Unknown", auth0Accounts: [] })

  const matching = (filter: Parameters<typeof matchesAccessFilter>[1]) =>
    [
      ["canLogIn", canLogIn],
      ["blocked", blocked],
      ["partly", partly],
      ["legacy", legacy],
      ["unknown", unknown],
    ]
      .filter(([, u]) => matchesAccessFilter(u as never, filter))
      .map(([name]) => name)

  it("defaults to everyone who has access", () => {
    expect(DEFAULT_ACCESS_FILTER).toBe("active")
  })

  it("counts a partly blocked person as active, since they can still log in", () => {
    // The row most worth seeing must not be hidden by the default.
    expect(matching("active")).toEqual(["canLogIn", "partly", "unknown"])
  })

  it("offers no two options that select the same people", () => {
    // Compared with Auth0 readable, which is the normal case. A removed option
    // called "can log in" selected exactly what "has access" does whenever
    // Auth0 answered, and differed only when it did not -- by showing an empty
    // table. Including the unreachable case here would have let that pass.
    const observable = (filter: Parameters<typeof matchesAccessFilter>[1]) =>
      matching(filter)
        .filter((name) => name !== "unknown")
        .join("|")

    const selections = ACCESS_FILTERS.map(observable)
    expect(new Set(selections).size).toBe(ACCESS_FILTERS.length)
  })

  it("excludes the blocked and the legacy from active", () => {
    expect(matching("active")).not.toContain("blocked")
    expect(matching("active")).not.toContain("legacy")
  })

  it.each([
    ["blocked", ["blocked"]],
    ["partlyBlocked", ["partly"]],
    ["legacy", ["legacy"]],
  ])("%s selects only that state", (filter, expected) => {
    expect(matching(filter as never)).toEqual(expected)
  })

  it("everyone selects everyone", () => {
    expect(matching("all")).toHaveLength(5)
  })

  it("rejects a filter name it does not know", () => {
    expect(isAccessFilter("active")).toBe(true)
    expect(isAccessFilter("nonsense")).toBe(false)
  })
})

describe("the role filter", () => {
  const superadmin = person({ roles: ["Superadmin"] })
  const noRole = person({ roles: [] })
  const legacy = person({ presence: "localOnly", roles: [], auth0Accounts: [] })

  it("selects a single role", () => {
    expect(matchesRoleFilter(superadmin, "Superadmin")).toBe(true)
    expect(matchesRoleFilter(noRole, "Superadmin")).toBe(false)
  })

  it("selects accounts that can log in and hold no role", () => {
    expect(matchesRoleFilter(noRole, "none")).toBe(true)
  })

  it("does not report a legacy contributor as having no role", () => {
    // They have no Auth0 account, so no role is expected rather than a
    // finding. Including them would bury the accounts that can log in.
    expect(matchesRoleFilter(legacy, "none")).toBe(false)
  })

  it("rejects a filter name it does not know", () => {
    expect(isRoleFilter("Superadmin")).toBe(true)
    expect(isRoleFilter("Admin")).toBe(false)
  })
})

describe("hasPassword", () => {
  it("is true for an account on the username-and-password connection", () => {
    expect(hasPassword({ connection: DATABASE_CONNECTION })).toBe(true)
  })

  it("is false for a Google account", () => {
    // A social account has no password in Auth0, so there is nothing to set
    // and no link worth offering.
    expect(hasPassword({ connection: "google-oauth2" })).toBe(false)
  })

  it("is false for an account whose connection is unknown", () => {
    expect(hasPassword({ connection: null })).toBe(false)
  })
})
