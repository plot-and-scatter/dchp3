import { render, screen, within } from "@testing-library/react"
import UserDirectoryTable from "./UserDirectoryTable"
import type { DirectoryUser } from "~/services/auth/userDirectory.server"

// What the table has to communicate is which system each person exists in,
// because that is what an administrator cannot find out anywhere else and it
// decides what to do about them.

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
    expect(row.getByText("Active")).toBeInTheDocument()
    expect(row.getByText("Auth0 and database")).toBeInTheDocument()
  })

  it("says an Auth0-only account has never logged in", () => {
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
    expect(row.getByText("Auth0 only — no database record")).toBeInTheDocument()
    expect(row.getByText("No local record yet")).toBeInTheDocument()
    expect(row.queryByText(/never logged in/)).not.toBeInTheDocument()
  })

  it("says a database-only person cannot log in", () => {
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

    expect(row.getByText("Database only — cannot log in")).toBeInTheDocument()
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

    expect(row.getByText("Database — Auth0 not read")).toBeInTheDocument()
    expect(row.queryByText(/cannot log in/)).not.toBeInTheDocument()
  })

  const account = (overrides = {}) => ({
    userId: "auth0|1",
    connection: "Username-Password-Authentication",
    blocked: false,
    roles: [],
    ...overrides,
  })

  it("marks a blocked account as deactivated whatever the local row says", () => {
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

    expect(row.getByText("Deactivated")).toBeInTheDocument()
    expect(row.queryByText("Active")).not.toBeInTheDocument()
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

    // Saying "Deactivated" here would be wrong: they can still log in.
    expect(
      row.getByText("Partly deactivated — can still log in")
    ).toBeInTheDocument()
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

  it("flags an Auth0 account with no role rather than leaving the cell blank", () => {
    render(<UserDirectoryTable users={[user({ roles: [] })]} />)
    expect(screen.getByText("No role assigned")).toBeInTheDocument()
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
