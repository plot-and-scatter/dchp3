import { render, screen, within } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import UserDirectoryTable from "./UserDirectoryTable"
import type { DirectoryUser } from "~/services/auth/userDirectory"

// Two questions decide what an administrator does about a row: can this person
// log in, and may they do anything once they have. Both are badges, and these
// tests are mostly about the badge being right rather than merely present --
// several of the states are ones where the obvious wording would be false.

const user = (overrides: Partial<DirectoryUser> = {}): DirectoryUser => ({
  email: "someone@example.com",
  name: "Some One",
  presence: "both",
  roles: ["Student / Editor"],
  auth0Accounts: [
    {
      userId: "auth0|1",
      connection: "Username-Password-Authentication",
      blocked: false,
      lastLogin: null,
      loginsCount: 0,
      roles: ["Student / Editor"],
    },
  ],
  localRows: [{ id: 1, is_active: 1 } as DirectoryUser["localRows"][number]],
  contributions: { edits: 0, citations: 0 },
  ...overrides,
})

// The headings are sort links now, so the table needs a router around it.
// Sorting itself is covered in userDirectory.server.test.ts, against the pure
// comparator rather than through the DOM.
const renderTable = (
  users: DirectoryUser[],
  overrides: Partial<React.ComponentProps<typeof UserDirectoryTable>> = {}
) =>
  render(
    <MemoryRouter>
      <UserDirectoryTable
        users={users}
        sort="name"
        direction="asc"
        searchParams={new URLSearchParams()}
        roleFilter="all"
        accessFilter="all"
        onFilterChange={() => {}}
        {...overrides}
      />
    </MemoryRouter>
  )

const rowFor = (name: string) => screen.getByText(name).closest("tr")!

describe("UserDirectoryTable", () => {
  it("says so when there is nobody to show", () => {
    renderTable([])
    expect(screen.getByText("There is nobody to show.")).toBeInTheDocument()
  })

  describe("filtered down to nothing", () => {
    // The filter menus are in the table head, so an early return on an empty
    // list left a reader with no way to undo the filter that emptied it.
    const renderEmptyFiltered = (onFilterChange = () => {}) =>
      renderTable([], {
        roleFilter: "none",
        accessFilter: "blocked",
        onFilterChange,
      })

    it("still shows the filter menus", () => {
      renderEmptyFiltered()
      expect(screen.getByLabelText("Filter by role")).toBeInTheDocument()
      expect(screen.getByLabelText("Filter by Auth0 login")).toBeInTheDocument()
    })

    it("says the filters are the reason, not that there are no users", () => {
      renderEmptyFiltered()
      expect(
        screen.getByText("Nobody matches these filters.")
      ).toBeInTheDocument()
    })

    it("offers a way out that resets both filters", () => {
      const onFilterChange = vi.fn()
      renderEmptyFiltered(onFilterChange)

      screen.getByText("Show everyone").click()

      const next = onFilterChange.mock.calls[0][0] as URLSearchParams
      expect(next.get("role")).toBe("all")
      expect(next.get("access")).toBe("all")
    })

    it("does not offer the way out when nothing is filtered", () => {
      renderTable([])
      expect(screen.queryByText("Show everyone")).not.toBeInTheDocument()
    })
  })

  it("shows a person in both systems with their role and status", () => {
    renderTable([user()])
    const row = within(rowFor("Some One"))

    expect(row.getByText("someone@example.com")).toBeInTheDocument()
    expect(row.getByText("Student / Editor")).toBeInTheDocument()
    expect(row.getByText("Can log in")).toBeInTheDocument()
  })

  it("does not claim an Auth0-only account has never logged in", () => {
    renderTable([
      user({ name: "New Person", presence: "auth0Only", localRows: [] }),
    ])
    const row = within(rowFor("New Person"))

    // Not "has never logged in": the join knows only that there is no local
    // row, and every account in the tenant has logged in at least once.
    expect(row.getByText("No local record")).toBeInTheDocument()
    expect(row.queryByText(/never logged in/)).not.toBeInTheDocument()
  })

  it("shows a database-only person as having no way to log in", () => {
    renderTable([
      user({
        name: "Old Hand",
        presence: "localOnly",
        roles: [],
        auth0Accounts: [],
      }),
    ])
    const row = within(rowFor("Old Hand"))

    // No Auth0 account means no way in, and the badge says so.
    expect(row.getByText("No account")).toBeInTheDocument()
  })

  it("does not claim anything about login when Auth0 was not read", () => {
    renderTable([
      user({
        name: "Unknown Status",
        presence: "auth0Unknown",
        roles: [],
        auth0Accounts: [],
      }),
    ])
    const row = within(rowFor("Unknown Status"))

    // Nothing is claimed about whether they can log in.
    expect(row.queryByText("No account")).not.toBeInTheDocument()
    expect(row.queryByText("Blocked")).not.toBeInTheDocument()
    expect(row.queryByText("Can log in")).not.toBeInTheDocument()
  })

  const account = (overrides = {}) => ({
    userId: "auth0|1",
    connection: "Username-Password-Authentication",
    blocked: false,
    lastLogin: null,
    loginsCount: 0,
    roles: [],
    ...overrides,
  })

  it("marks a blocked account as blocked whatever the local row says", () => {
    renderTable([
      user({
        name: "Blocked Person",
        auth0Accounts: [account({ blocked: true })],
      }),
    ])
    const row = within(rowFor("Blocked Person"))

    expect(row.getByText("Blocked")).toBeInTheDocument()
    expect(row.queryByText("Can log in")).not.toBeInTheDocument()
  })

  it("warns when only some of a person's accounts are blocked", () => {
    renderTable([
      user({
        name: "Half Blocked",
        auth0Accounts: [
          account({ userId: "auth0|1", blocked: true }),
          account({
            userId: "google-oauth2|2",
            connection: "google-oauth2",
            blocked: false,
          }),
        ],
      }),
    ])
    const row = within(rowFor("Half Blocked"))

    // Saying "Blocked" here would be wrong: they can still log in.
    expect(row.getByText("Partly blocked")).toBeInTheDocument()
    expect(row.queryByText("Blocked")).not.toBeInTheDocument()
  })

  it("shows when one address has two unlinked Auth0 accounts", () => {
    renderTable([
      user({
        name: "Two Accounts",
        auth0Accounts: [
          account({ userId: "auth0|1" }),
          account({
            userId: "google-oauth2|2",
            connection: "google-oauth2",
          }),
        ],
      }),
    ])

    // One icon per account: a Google mark and a key, rather than a sentence.
    expect(screen.getByTitle("Signs in with Google")).toBeInTheDocument()
    expect(
      screen.getByTitle("Signs in with an email address and password")
    ).toBeInTheDocument()
    expect(screen.getByText("(2 accounts)")).toBeInTheDocument()
  })

  it("flags an Auth0 account with no role, which is the audit case", () => {
    // Someone who signed themselves up holds no role: they can log in and have
    // no permission at all.
    renderTable([user({ roles: [] })])
    // Scoped to the row: the Role heading's filter menu also offers "No role".
    expect(within(rowFor("Some One")).getByText("No role")).toBeInTheDocument()
  })

  it("does not call a database-only row role-less, since it cannot log in", () => {
    renderTable([
      user({
        name: "Old Hand",
        roles: [],
        presence: "localOnly",
        auth0Accounts: [],
      }),
    ])
    expect(
      within(rowFor("Old Hand")).queryByText("No role")
    ).not.toBeInTheDocument()
  })

  it("labels a person with no Auth0 account as legacy, not as a problem", () => {
    renderTable([
      user({
        name: "Old Hand",
        presence: "localOnly",
        roles: [],
        auth0Accounts: [],
        contributions: { edits: 40, citations: 12 },
      }),
    ])
    const row = within(rowFor("Old Hand"))

    expect(row.getByText("No account")).toBeInTheDocument()
    // Their contributions are still counted -- that is why the row exists.
    expect(row.getByText("52")).toBeInTheDocument()
  })

  it("shows the contributions total, summing edits and citations", () => {
    renderTable([user({ contributions: { edits: 800, citations: 65 } })])
    expect(screen.getByText("865")).toBeInTheDocument()
  })

  it("says None rather than nought for someone who has done nothing", () => {
    // This is the row that pairs with "No role" to mean "signed themselves up".
    renderTable([
      user({ roles: [], contributions: { edits: 0, citations: 0 } }),
    ])
    // Scoped to the row: the Role heading's filter menu also offers "No role".
    const row = within(rowFor("Some One"))
    expect(row.getByText("None")).toBeInTheDocument()
    expect(row.getByText("No role")).toBeInTheDocument()
  })

  it("shows the date of the most recent sign-in across accounts", () => {
    renderTable([
      user({
        auth0Accounts: [
          account({ userId: "auth0|1", lastLogin: "2026-08-23T10:00:00.000Z" }),
          account({
            userId: "google-oauth2|2",
            connection: "google-oauth2",
            lastLogin: "2026-08-28T09:00:00.000Z",
          }),
        ],
      }),
    ])
    // Formatted in UTC, so the server and the browser agree.
    expect(screen.getByText("2026-08-28")).toBeInTheDocument()
  })

  it("says Never for an account that has not been used", () => {
    renderTable([user({ auth0Accounts: [account({ lastLogin: null })] })])
    expect(screen.getByText("Never")).toBeInTheDocument()
  })

  it("shows when several database rows share one address", () => {
    renderTable([
      user({
        localRows: [
          { id: 1, is_active: 1 },
          { id: 2, is_active: 0 },
        ] as DirectoryUser["localRows"],
      }),
    ])
    // Worded so it cannot be read as being about the Auth0 connection: it is
    // about the user table having no unique index on email.
    expect(
      screen.getByText(
        /2 records in this site.s own database share this address/
      )
    ).toBeInTheDocument()
  })

  it("marks a Google-only account with the Google icon alone", () => {
    renderTable([
      user({
        auth0Accounts: [
          account({ userId: "google-oauth2|1", connection: "google-oauth2" }),
        ],
      }),
    ])
    expect(screen.getByTitle("Signs in with Google")).toBeInTheDocument()
    expect(screen.queryByText("(2 accounts)")).not.toBeInTheDocument()
  })

  it("shows no connection icon for someone with no Auth0 account", () => {
    renderTable([user({ presence: "localOnly", auth0Accounts: [], roles: [] })])
    expect(screen.queryByTitle(/Signs in/)).not.toBeInTheDocument()
  })

  it("shows a local row that has no email address", () => {
    renderTable([
      user({ name: "No Address", email: null, presence: "localOnly" }),
    ])
    expect(screen.getByText("No email")).toBeInTheDocument()
  })
})
