import { render, screen } from "@testing-library/react"
import PasswordLinkPanel from "./PasswordLinkPanel"

// This is the only place the one-time link is ever shown. It is not stored and
// not recoverable, so a panel that rendered the wrong branch, or an empty
// field, would lose it silently.

const LINK = "https://tenant.auth0.test/lo/reset?ticket=abc123"

describe("PasswordLinkPanel", () => {
  it("shows the link where it can be read and copied", () => {
    render(<PasswordLinkPanel ticketUrl={LINK} warnings={[]} />)

    expect(screen.getByDisplayValue(LINK)).toBeInTheDocument()
  })

  it("names the person when one was just created", () => {
    render(
      <PasswordLinkPanel
        ticketUrl={LINK}
        warnings={[]}
        created="new@example.com"
      />
    )

    expect(screen.getByText("new@example.com was created.")).toBeInTheDocument()
  })

  it("says it will not be shown again", () => {
    // The link cannot be recovered, only replaced, and somebody who does not
    // know that will close the page.
    render(<PasswordLinkPanel ticketUrl={LINK} warnings={[]} />)

    expect(screen.getByText(/not shown again/)).toBeInTheDocument()
  })

  it("says what to do instead when no link could be made", () => {
    render(<PasswordLinkPanel ticketUrl={null} warnings={[]} />)

    expect(screen.queryByDisplayValue(LINK)).not.toBeInTheDocument()
    expect(screen.getByText(/Make one from their page/)).toBeInTheDocument()
  })

  it("shows every warning, since each is something to act on", () => {
    render(
      <PasswordLinkPanel
        ticketUrl={LINK}
        warnings={["The role was not assigned.", "The record was not created."]}
      />
    )

    expect(screen.getByText("The role was not assigned.")).toBeInTheDocument()
    expect(screen.getByText("The record was not created.")).toBeInTheDocument()
  })

  it("offers a copy button, the link being long and easy to truncate by hand", () => {
    render(<PasswordLinkPanel ticketUrl={LINK} warnings={[]} />)

    expect(screen.getByText("Copy")).toBeInTheDocument()
  })
})
