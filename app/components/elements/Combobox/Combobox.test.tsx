import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Combobox from "./Combobox"

// The schemas behind "Add see also" and "Add reference link" read this
// component's output as a nested object -- headword.label and headword.value.
// Letting Headless UI name the inputs itself would produce headword[label] and
// headword[value], which conform discards, so these tests pin the names the
// component actually posts as well as the values.

const options = [
  { label: "toque", value: "99" },
  { label: "chesterfield", value: "42" },
]

const hiddenInput = (container: HTMLElement, name: string) =>
  container.querySelector<HTMLInputElement>(
    `input[type="hidden"][name="${name}"]`
  )

describe("Combobox", () => {
  it("posts its selection under dot-separated names, not bracketed ones", () => {
    const { container } = render(<Combobox name="headword" options={options} />)

    expect(hiddenInput(container, "headword.label")).toBeInTheDocument()
    expect(hiddenInput(container, "headword.value")).toBeInTheDocument()
    expect(hiddenInput(container, "headword[label]")).toBeNull()
    expect(hiddenInput(container, "headword[value]")).toBeNull()
  })

  it("posts empty values until something is chosen", () => {
    const { container } = render(<Combobox name="headword" options={options} />)

    expect(hiddenInput(container, "headword.label")).toHaveValue("")
    expect(hiddenInput(container, "headword.value")).toHaveValue("")
  })

  it("posts the label and the id of the chosen option", async () => {
    const user = userEvent.setup()
    const { container } = render(<Combobox name="headword" options={options} />)

    await user.click(screen.getByRole("button"))
    await user.click(screen.getByText("chesterfield"))

    expect(hiddenInput(container, "headword.label")).toHaveValue("chesterfield")
    expect(hiddenInput(container, "headword.value")).toHaveValue("42")
  })

  it("uses whatever name it is given", () => {
    const { container } = render(
      <Combobox name="referenceId" options={options} />
    )

    expect(hiddenInput(container, "referenceId.label")).toBeInTheDocument()
    expect(hiddenInput(container, "referenceId.value")).toBeInTheDocument()
  })
})
