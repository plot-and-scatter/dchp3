import { render, screen } from "@testing-library/react"
import SearchTermInput from "./SearchTermInput"

// Natalia asked (Nov 2026) for two more tips under the search box, with the
// three of them highlighted. The texts are hers, so the test holds them to
// her wording.

const renderInput = () =>
  render(
    <SearchTermInput
      data={{ searchParams: { searchTerm: "" } }}
      fields={{ searchTerm: {}, caseSensitive: {} }}
    />
  )

describe("SearchTermInput", () => {
  it("shows the three search tips in a highlighted panel", () => {
    renderInput()
    const tips = screen.getAllByRole("listitem")
    expect(tips).toHaveLength(3)
    expect(tips[0]).toHaveTextContent("You can enter * to match all entries.")
    expect(tips[1]).toHaveTextContent(
      "You can search for headwords using any documented spelling variant (e.g. entering abatteau will call up the aboiteau entry)."
    )
    expect(tips[2]).toHaveTextContent(
      "You can search for words or phrases in any of the six dictionary sections (Headword, Meaning, Canadianism note, Usage note, Fist note and Quotation block). Select the relevant tab at the top of the search results."
    )
    expect(screen.getByRole("list")).toHaveClass("bg-amber-50")
  })

  it("italicizes the example headwords", () => {
    renderInput()
    expect(screen.getByText("abatteau").tagName).toBe("I")
    expect(screen.getByText("aboiteau").tagName).toBe("I")
  })
})
