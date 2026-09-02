import { render, screen, act } from "@testing-library/react"
import TransientNotice from "./TransientNotice"

// Fake timers throughout: the point of this component is what happens after
// five seconds, and waiting five seconds in a test is not a test.

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

const advance = (ms: number) => act(() => void vi.advanceTimersByTime(ms))

describe("TransientNotice", () => {
  it("shows its message straight away", () => {
    render(<TransientNotice>Name saved.</TransientNotice>)
    expect(screen.getByText("Name saved.")).toBeInTheDocument()
  })

  it("is announced to a screen reader when it appears", () => {
    // It has gone by the time anyone could go looking for it, so it has to
    // announce itself rather than wait to be found.
    render(<TransientNotice>Name saved.</TransientNotice>)
    expect(screen.getByRole("status")).toBeInTheDocument()
  })

  it("is still there after four seconds", () => {
    render(<TransientNotice>Name saved.</TransientNotice>)
    advance(4000)
    expect(screen.getByText("Name saved.")).toBeInTheDocument()
  })

  it("fades before it goes, rather than vanishing between glances", () => {
    render(<TransientNotice>Name saved.</TransientNotice>)
    advance(5000)

    expect(screen.getByRole("status")).toHaveClass("opacity-0")
    expect(screen.getByText("Name saved.")).toBeInTheDocument()
  })

  it("has gone once the fade is over", () => {
    render(<TransientNotice>Name saved.</TransientNotice>)
    advance(5700)
    expect(screen.queryByText("Name saved.")).not.toBeInTheDocument()
  })

  it("comes back when the reset key changes", () => {
    // A second save must confirm itself, not stay silent because the first
    // confirmation had already gone.
    const { rerender } = render(
      <TransientNotice resetKey={1}>Name saved.</TransientNotice>
    )
    advance(6000)
    expect(screen.queryByText("Name saved.")).not.toBeInTheDocument()

    rerender(<TransientNotice resetKey={2}>Name saved.</TransientNotice>)
    expect(screen.getByText("Name saved.")).toBeInTheDocument()
  })

  it("turns the fade off where motion is not wanted", () => {
    render(<TransientNotice>Name saved.</TransientNotice>)
    expect(screen.getByRole("status")).toHaveClass(
      "motion-reduce:transition-none"
    )
  })
})
