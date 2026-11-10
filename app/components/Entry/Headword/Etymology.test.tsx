import { render, screen } from "@testing-library/react"
import Etymology from "./Etymology"

// The etymology used to be italic as a whole, so the <i> tags editors put on
// individual words (e.g. the French source word) made no visible difference.
// Natalia asked (Nov 2026) for the default italics to go so that only the
// marked words are italic.

const entryWith = (etymology: string) =>
  ({ etymology } as unknown as React.ComponentProps<typeof Etymology>["entry"])

describe("Etymology", () => {
  it("renders the text upright and keeps the editor's own italics", () => {
    render(
      <Etymology entry={entryWith("[< Cdn F <i>guichet</i> 'counter']")} />
    )
    const wrapper = screen.getByText(/Cdn F/).closest("span.ml-3")
    expect(wrapper).not.toHaveClass("italic")
    expect(screen.getByText("guichet").tagName).toBe("I")
  })

  it("renders nothing when there is no etymology", () => {
    const { container } = render(<Etymology entry={entryWith("")} />)
    expect(container).toBeEmptyDOMElement()
  })
})
