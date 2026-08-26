import { render, screen } from "@testing-library/react"
import FormConflictBanner from "./FormConflictBanner"

describe("FormConflictBanner", () => {
  it("shows the conflict message", () => {
    render(<FormConflictBanner actionData={{ conflictMessage: "Nope." }} />)
    expect(screen.getByRole("alert")).toHaveTextContent("Nope.")
  })

  it("renders nothing when the action returned no conflict", () => {
    render(<FormConflictBanner actionData={undefined} />)
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })

  it("renders nothing for a conform submission result", () => {
    // The same action also returns submission.reply() results, which must not
    // be mistaken for a conflict.
    render(<FormConflictBanner actionData={{ status: "error", error: {} }} />)
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })
})
