// @vitest-environment node
import {
  isLegacyUser,
  isSortColumn,
  SORT_COLUMNS,
  sortDirectoryUsers,
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
