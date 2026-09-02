import { render, screen, waitFor } from "@testing-library/react"
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

describe("copying the link", () => {
  // navigator.clipboard exists only in a secure context, so it is absent over
  // plain http. Staging is served that way, and the button used to report
  // success there having copied nothing.
  const withClipboard = (writeText: () => Promise<void>) =>
    vi.stubGlobal("navigator", { clipboard: { writeText } })

  afterEach(() => vi.unstubAllGlobals())

  it("uses the clipboard when there is one", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    withClipboard(writeText)

    render(<PasswordLinkPanel ticketUrl={LINK} warnings={[]} />)
    screen.getByText("Copy").click()

    await waitFor(() => expect(writeText).toHaveBeenCalledWith(LINK))
    await waitFor(() => expect(screen.getByText("Copied")).toBeInTheDocument())
  })

  it("falls back when there is no clipboard, as on plain http", async () => {
    vi.stubGlobal("navigator", {})
    document.execCommand = vi.fn().mockReturnValue(true)

    render(<PasswordLinkPanel ticketUrl={LINK} warnings={[]} />)
    screen.getByText("Copy").click()

    await waitFor(() =>
      expect(document.execCommand).toHaveBeenCalledWith("copy")
    )
    await waitFor(() => expect(screen.getByText("Copied")).toBeInTheDocument())
  })

  it("says so rather than claiming success when nothing worked", async () => {
    vi.stubGlobal("navigator", {})
    document.execCommand = vi.fn().mockReturnValue(false)

    render(<PasswordLinkPanel ticketUrl={LINK} warnings={[]} />)
    screen.getByText("Copy").click()

    await waitFor(() =>
      expect(screen.getByText(/copy it yourself/)).toBeInTheDocument()
    )
    expect(screen.queryByText("Copied")).not.toBeInTheDocument()
  })

  it("does not claim success when the clipboard rejects", async () => {
    withClipboard(vi.fn().mockRejectedValue(new Error("denied")))
    document.execCommand = vi.fn().mockReturnValue(false)

    render(<PasswordLinkPanel ticketUrl={LINK} warnings={[]} />)
    screen.getByText("Copy").click()

    await waitFor(() =>
      expect(screen.getByText(/copy it yourself/)).toBeInTheDocument()
    )
  })
})
