import { render } from "@testing-library/react"
import SanitizedTextSpan from "./SanitizedTextSpan"

// This component is the only consumer of DOMPurify, and it renders its output
// via dangerouslySetInnerHTML. These tests pin the sanitising behaviour so a
// future DOMPurify upgrade can't silently stop stripping scripts.

describe("SanitizedTextSpan", () => {
  it("renders nothing for empty, null or undefined text", () => {
    expect(
      render(<SanitizedTextSpan text={undefined} />).container
    ).toBeEmptyDOMElement()
    expect(
      render(<SanitizedTextSpan text={null} />).container
    ).toBeEmptyDOMElement()
    expect(
      render(<SanitizedTextSpan text="" />).container
    ).toBeEmptyDOMElement()
  })

  it("passes plain text through unchanged", () => {
    const { container } = render(<SanitizedTextSpan text="a plain headword" />)
    expect(container).toHaveTextContent("a plain headword")
  })

  it("preserves benign inline markup", () => {
    const { container } = render(
      <SanitizedTextSpan text="an <em>emphasised</em> word" />
    )
    expect(container.querySelector("em")).toHaveTextContent("emphasised")
  })

  it("strips script tags", () => {
    const { container } = render(
      <SanitizedTextSpan text={`safe<script>alert("xss")</script>`} />
    )
    expect(container.querySelector("script")).toBeNull()
    expect(container.innerHTML).not.toContain("alert")
  })

  it("strips inline event handlers", () => {
    const { container } = render(
      <SanitizedTextSpan text={`<img src="x" onerror="alert('xss')" />`} />
    )
    expect(container.querySelector("img")).not.toHaveAttribute("onerror")
    expect(container.innerHTML).not.toContain("alert")
  })

  it("strips javascript: URLs, keeping the link text", () => {
    // eslint-disable-next-line no-script-url
    const payload = `<a href="javascript:alert('xss')">link</a>`
    const { container } = render(<SanitizedTextSpan text={payload} />)
    // DOMPurify drops the offending attribute outright rather than rewriting it.
    expect(container.querySelector("a")).not.toHaveAttribute("href")
    // eslint-disable-next-line no-script-url
    expect(container.innerHTML).not.toContain("javascript:")
    expect(container).toHaveTextContent("link")
  })

  it("expands single breaks to double when toDoubleBreaks is set", () => {
    const { container } = render(
      <SanitizedTextSpan text="one<br>two" toDoubleBreaks />
    )
    expect(container.querySelectorAll("br")).toHaveLength(2)
  })

  it("leaves breaks alone when toDoubleBreaks is not set", () => {
    const { container } = render(<SanitizedTextSpan text="one<br>two" />)
    expect(container.querySelectorAll("br")).toHaveLength(1)
  })

  it("sanitises after the double-break conversion", () => {
    const { container } = render(
      <SanitizedTextSpan
        text={`a<br><script>alert(1)</script>`}
        toDoubleBreaks
      />
    )
    expect(container.querySelector("script")).toBeNull()
    expect(container.querySelectorAll("br")).toHaveLength(2)
  })
})
