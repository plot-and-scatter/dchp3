import { describe, expect, it } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { createRoutesStub } from "react-router"
import { Link } from "./Link"

// The archives (/dchp1, /dchp2) are separate apps behind the same hostname as
// DCHP-3. A click on a full address must be left to the browser; if React
// Router handles it, the visitor gets DCHP-3's "not found" page.
const renderLinks = () => {
  const Stub = createRoutesStub([
    {
      path: "/",
      Component: () => (
        <div>
          <Link to={`${window.location.origin}/dchp2`}>archive</Link>
          <Link to="/about">about</Link>
        </div>
      ),
    },
    { path: "/about", Component: () => <p>About page</p> },
    { path: "*", Component: () => <p>Not found page</p> },
  ])
  render(<Stub />)
}

// A click the router handles has preventDefault called on it, so
// fireEvent.click returns false. A click left to the browser returns true.
describe("Link", () => {
  it("leaves a full address on the same hostname to the browser", () => {
    renderLinks()
    const link = screen.getByText("archive")
    expect(link).toHaveAttribute("href", `${window.location.origin}/dchp2`)
    expect(fireEvent.click(link)).toBe(true)
    expect(screen.queryByText("Not found page")).not.toBeInTheDocument()
  })

  it("still handles a path inside the app without a page load", async () => {
    renderLinks()
    expect(fireEvent.click(screen.getByText("about"))).toBe(false)
    expect(await screen.findByText("About page")).toBeInTheDocument()
  })
})
