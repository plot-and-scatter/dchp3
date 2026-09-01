import { render, screen, within } from "@testing-library/react"
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
      roles: ["Student / Editor"],
    },
  ],
  localRows: [{ id: 1, is_active: 1 } as DirectoryUser["localRows"][number]],
  ...overrides,
})

const rowFor = (name: string) => screen.getByText(name).closest("tr")!

describe("UserDirectoryTable", () => {
  it("says so when there is nobody to show", () => {
    render(<UserDirectoryTable users={[]} />)
    expect(screen.getByText("No users found.")).toBeInTheDocument()
  })

  it("shows a person in both systems with their role and status", () => {
    render(<UserDirectoryTable users={[user()]} />)
    const row = within(rowFor("Some One"))

    expect(row.getByText("someone@example.com")).toBeInTheDocument()
    expect(row.getByText("Student / Editor")).toBeInTheDocument()
    expect(row.getByText("Can log in")).toBeInTheDocument()
    expect(row.getByText("Auth0 + database")).toBeInTheDocument()
  })

  it("does not claim an Auth0-only account has never logged in", () => {
    render(
      <UserDirectoryTable
        users={[
          user({ name: "New Person", presence: "auth0Only", localRows: [] }),
        ]}
      />
    )
    const row = within(rowFor("New Person"))

    // Not "has never logged in": the join knows only that there is no local
    // row, and every account in the tenant has logged in at least once.
    expect(row.getByText("Auth0 only")).toBeInTheDocument()
    expect(row.queryByText(/never logged in/)).not.toBeInTheDocument()
  })

  it("shows a database-only person as having no way to log in", () => {
    render(
      <UserDirectoryTable
        users={[
          user({
            name: "Old Hand",
            presence: "localOnly",
            roles: [],
            auth0Accounts: [],
          }),
        ]}
      />
    )
    const row = within(rowFor("Old Hand"))

    expect(row.getByText("Database only")).toBeInTheDocument()
    // No Auth0 account means no way in, and the badge says so.
    expect(row.getByText("No login")).toBeInTheDocument()
  })

  it("does not claim anything about login when Auth0 was not read", () => {
    render(
      <UserDirectoryTable
        users={[
          user({
            name: "Unknown Status",
            presence: "auth0Unknown",
            roles: [],
            auth0Accounts: [],
          }),
        ]}
      />
    )
    const row = within(rowFor("Unknown Status"))

    expect(row.getByText("Auth0 not read")).toBeInTheDocument()
    // Nothing is claimed about whether they can log in.
    expect(row.queryByText("No login")).not.toBeInTheDocument()
    expect(row.queryByText("Blocked")).not.toBeInTheDocument()
    expect(row.queryByText("Can log in")).not.toBeInTheDocument()
  })

  const account = (overrides = {}) => ({
    userId: "auth0|1",
    connection: "Username-Password-Authentication",
    blocked: false,
    roles: [],
    ...overrides,
  })

  it("marks a blocked account as blocked whatever the local row says", () => {
    render(
      <UserDirectoryTable
        users={[
          user({
            name: "Blocked Person",
            auth0Accounts: [account({ blocked: true })],
          }),
        ]}
      />
    )
    const row = within(rowFor("Blocked Person"))

    expect(row.getByText("Blocked")).toBeInTheDocument()
    expect(row.queryByText("Can log in")).not.toBeInTheDocument()
  })

  it("warns when only some of a person's accounts are blocked", () => {
    render(
      <UserDirectoryTable
        users={[
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
        ]}
      />
    )
    const row = within(rowFor("Half Blocked"))

    // Saying "Blocked" here would be wrong: they can still log in.
    expect(row.getByText("Partly blocked")).toBeInTheDocument()
    expect(row.queryByText("Blocked")).not.toBeInTheDocument()
  })

  it("shows when one address has two unlinked Auth0 accounts", () => {
    render(
      <UserDirectoryTable
        users={[
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
        ]}
      />
    )

    expect(screen.getByText(/2 separate Auth0 accounts/)).toBeInTheDocument()
    expect(screen.getByText(/google-oauth2/)).toBeInTheDocument()
  })

  it("flags an Auth0 account with no role, which is the audit case", () => {
    // Someone who signed themselves up holds no role: they can log in and have
    // no permission at all.
    render(<UserDirectoryTable users={[user({ roles: [] })]} />)
    expect(screen.getByText("No role")).toBeInTheDocument()
  })

  it("does not call a database-only row role-less, since it cannot log in", () => {
    render(
      <UserDirectoryTable
        users={[
          user({
            name: "Old Hand",
            roles: [],
            presence: "localOnly",
            auth0Accounts: [],
          }),
        ]}
      />
    )
    expect(screen.queryByText("No role")).not.toBeInTheDocument()
  })

  it("shows when several database rows share one address", () => {
    render(
      <UserDirectoryTable
        users={[
          user({
            localRows: [
              { id: 1, is_active: 1 },
              { id: 2, is_active: 0 },
            ] as DirectoryUser["localRows"],
          }),
        ]}
      />
    )
    expect(
      screen.getByText("2 database rows share this address")
    ).toBeInTheDocument()
  })

  it("shows a local row that has no email address", () => {
    render(
      <UserDirectoryTable
        users={[
          user({ name: "No Address", email: null, presence: "localOnly" }),
        ]}
      />
    )
    expect(screen.getByText("No email")).toBeInTheDocument()
  })
})
