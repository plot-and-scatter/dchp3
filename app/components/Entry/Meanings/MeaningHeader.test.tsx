import { render, screen } from "@testing-library/react"
import MeaningHeader from "./MeaningHeader"

// A meaning flagged with the editor's "Dagger?" box is not Canadian and is
// listed for context. It used to show a dagger glyph (†) beside the meaning
// number; Natalia asked (Nov 2026) for the words "Non-Cdn." instead.

describe("MeaningHeader", () => {
  it('shows "Non-Cdn." instead of a dagger on a flagged meaning', () => {
    render(
      <MeaningHeader number="1" dagger partOfSpeech="adj. or adv." usage="" />
    )
    expect(screen.getByText("Non-Cdn.")).toBeInTheDocument()
    expect(screen.queryByText("†")).not.toBeInTheDocument()
  })

  it("shows neither on an ordinary meaning", () => {
    render(
      <MeaningHeader number="1" dagger={false} partOfSpeech="n." usage="" />
    )
    expect(screen.queryByText("Non-Cdn.")).not.toBeInTheDocument()
    expect(screen.queryByText("†")).not.toBeInTheDocument()
  })
})
