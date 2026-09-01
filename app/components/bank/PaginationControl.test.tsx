import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import PaginationControl from "./PaginationControl"

// Three link-building modes, and the two existing ones must keep working:
// path segments for the citation bank's /page/2 routes, an absolute url for
// pages whose loader supplies one, and query-only links for a page that sorts
// in the browser and therefore has no fresh url to hand.

const renderControl = (
  props: Partial<React.ComponentProps<typeof PaginationControl>>
) =>
  render(
    <MemoryRouter>
      <PaginationControl
        baseLink="/bank/search/dog"
        currentPage={2}
        pageCount={4}
        {...props}
      />
    </MemoryRouter>
  )

const hrefFor = (label: string) =>
  screen.getByText(label).closest("a")?.getAttribute("href")

describe("PaginationControl", () => {
  it("builds path links when useSearch is not set", () => {
    renderControl({})
    expect(hrefFor("3")).toBe("/bank/search/dog/3")
  })

  it("builds absolute links from url when one is given", () => {
    renderControl({
      useSearch: "page",
      url: "https://example.test/bank/search/dog?sort=year&page=2",
    })
    expect(hrefFor("3")).toBe(
      "https://example.test/bank/search/dog?sort=year&page=3"
    )
  })

  describe("searchParams mode", () => {
    const searchParams = new URLSearchParams("sort=role&dir=desc&page=2")

    it("builds query-only links", () => {
      renderControl({ useSearch: "page", searchParams })
      expect(hrefFor("3")).toBe("/?sort=role&dir=desc&page=3")
    })

    it("keeps the other parameters, so sorting survives paging", () => {
      renderControl({ useSearch: "page", searchParams })
      expect(hrefFor("3")).toContain("sort=role")
      expect(hrefFor("3")).toContain("dir=desc")
    })

    it("takes precedence over url, which may be stale", () => {
      renderControl({
        useSearch: "page",
        searchParams,
        url: "https://example.test/admin/users?page=1",
      })
      expect(hrefFor("3")).toBe("/?sort=role&dir=desc&page=3")
    })

    it("does not mutate the params it was given", () => {
      const params = new URLSearchParams("page=2")
      renderControl({ useSearch: "page", searchParams: params })
      expect(params.get("page")).toBe("2")
    })
  })
})
