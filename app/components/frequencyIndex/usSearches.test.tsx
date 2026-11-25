import { fireEvent, render, screen, within } from "@testing-library/react"
import { MemoryRouter, createRoutesStub } from "react-router"
import FrequencyIndexForm from "./FrequencyIndexForm"
import LookupRowsTable from "./LookupRowsTable"
import type {
  FrequencyDomainView,
  FrequencyLookupRowView,
} from "~/models/frequencyIndex.server"

// The US is counted with four searches, one per domain, added up. A single
// search across the four undercounts the normalizer, which made the US index
// about three times too high (GitHub issue 500). These tests pin what the
// student sees: four US rows to fill in, and one US index from the sums.

// Read from google.com on 2026-11-24: "toque", then "the".
const US = {
  "us.edu": ["181000", "1180000000"],
  "us.gov": ["14400", "4120000000"],
  "us.mil": ["252", "84700000"],
  "us.us": ["105000", "537000000"],
} as const

describe("the lookup form", () => {
  const renderForm = () => {
    const Stub = createRoutesStub([
      {
        path: "/",
        Component: () => (
          <FrequencyIndexForm
            defaults={{
              term: "toque",
              normalizer: "the",
              exclusions: "",
              multiplier: 1_000_000,
            }}
            recentNormalizerCounts={{}}
            normalizerHistories={{}}
            sparklineDays={90}
            lastResult={null}
          />
        ),
      },
    ])
    const view = render(<Stub />)
    fireEvent.click(screen.getByRole("button", { name: /Build table/ }))
    return view
  }

  const field = (container: HTMLElement, name: string) =>
    container.querySelector<HTMLInputElement>(`input[name="${name}"]`)!

  it("asks for ten term counts and ten normalizer counts, four of each for the USA", () => {
    const { container } = renderForm()

    const keys = Array.from(
      container.querySelectorAll<HTMLInputElement>(
        'input[type=hidden][name$=".domainKey"]'
      ),
      (input) => input.value
    )
    expect(keys).toEqual([
      "ca",
      "us.edu",
      "us.gov",
      "us.mil",
      "us.us",
      "uk",
      "ie",
      "nz",
      "au",
      "za",
    ])
    expect(container.querySelectorAll("input[data-count-input]")).toHaveLength(
      20
    )
    expect(screen.getByText("4 searches, added up")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /Open all 10 term searches/ })
    ).toBeInTheDocument()
    expect(screen.getByText("0 of 10 searches complete")).toBeInTheDocument()
  })

  it("links each USA row to a search of one domain, never the four joined by OR", () => {
    const { container } = renderForm()

    // Each "open" link carries its Google query as its title.
    const queries = Array.from(container.querySelectorAll("a[title]"), (a) =>
      a.getAttribute("title")
    )
    expect(queries).toHaveLength(20)
    expect(queries).toContain("toque site:.gov")
    expect(queries).toContain("the site:.gov")
    expect(queries.filter((q) => q?.includes(" OR "))).toEqual([])
  })

  it("shows one USA index, from the four counts added up, once all are typed", () => {
    const { container } = renderForm()
    const usaRow = screen.getByText("4 searches, added up").closest("tr")!

    // Three of four: no total and no index yet.
    Object.values(US)
      .slice(0, 3)
      .forEach(([term, normalizer], i) => {
        fireEvent.change(field(container, `rows[${i + 1}].termHits`), {
          target: { value: term },
        })
        fireEvent.change(field(container, `rows[${i + 1}].normalizerHits`), {
          target: { value: normalizer },
        })
      })
    expect(within(usaRow).queryByText("300,652")).not.toBeInTheDocument()

    fireEvent.change(field(container, "rows[4].termHits"), {
      target: { value: US["us.us"][0] },
    })
    fireEvent.change(field(container, "rows[4].normalizerHits"), {
      target: { value: US["us.us"][1] },
    })

    expect(within(usaRow).getByText("300,652")).toBeInTheDocument()
    expect(within(usaRow).getByText("5,921,700,000")).toBeInTheDocument()
    // 300,652 / 5,921,700,000 x 1,000,000. The single OR search gave 171.43.
    expect(within(usaRow).getByText("50.77")).toBeInTheDocument()
    expect(screen.getByText("4 of 10 searches complete")).toBeInTheDocument()
  })
})

describe("the saved lookup's table", () => {
  const row = (
    key: string,
    termHits: number,
    normalizerHits: number
  ): FrequencyLookupRowView => ({
    id: key.length * 1000 + termHits,
    domainKey: key,
    domainLabel: key === "us" ? "USA" : `USA ${key.slice(2)}`,
    siteClause: `site:${key.slice(2)}`,
    termQuery: `toque site:${key.slice(2)}`,
    normalizerQuery: `the site:${key.slice(2)}`,
    termHits,
    normalizerHits,
    frequencyIndex: (termHits / normalizerHits) * 1_000_000,
    normalizerCount: {
      id: 1,
      normalizer: "the",
      domainKey: key,
      hits: normalizerHits,
      observed: "2026-11-24",
      source: "lookup",
      lookup: null,
      user: { id: 3, first_name: "Nat", last_name: "M" },
      updated: null,
      updatedUser: null,
    },
    readHere: true,
  })

  const renderTable = (domains: FrequencyDomainView[]) =>
    render(
      <MemoryRouter>
        <LookupRowsTable domains={domains} multiplier={1_000_000} />
      </MemoryRouter>
    )

  it("shows the four USA counts under one total and one index", () => {
    const rows = Object.entries(US).map(([key, [term, normalizer]]) =>
      row(key, Number(term), Number(normalizer))
    )
    renderTable([
      {
        domainKey: "us",
        domainLabel: "USA",
        termHits: 300_652,
        normalizerHits: 5_921_700_000,
        frequencyIndex: 50.7712,
        method: "added",
        rows,
      },
    ])

    const total = screen.getByText("4 searches, added up").closest("tr")!
    expect(within(total).getByText("300,652")).toBeInTheDocument()
    expect(within(total).getByText("5,921,700,000")).toBeInTheDocument()
    expect(within(total).getByText("50.77")).toBeInTheDocument()
    // The four parts are listed with their own counts but no index of
    // their own: 50.77 appears once.
    expect(screen.getByText("181,000")).toBeInTheDocument()
    expect(screen.getByText("84,700,000")).toBeInTheDocument()
    const indexCells = screen.getAllByText(/^\d+\.\d\d$/)
    expect(indexCells.map((cell) => cell.textContent)).toEqual(["50.77"])
    expect(screen.queryByText(/too high/)).not.toBeInTheDocument()
  })

  it("says the index is too high for a USA count read with one combined search", () => {
    renderTable([
      {
        domainKey: "us",
        domainLabel: "USA",
        termHits: 300_000,
        normalizerHits: 1_750_000_000,
        frequencyIndex: 171.4286,
        method: "combined",
        rows: [row("us", 300_000, 1_750_000_000)],
      },
    ])

    expect(
      screen.getByText("One combined search: this index is too high.")
    ).toBeInTheDocument()
    expect(screen.getByText("171.43")).toBeInTheDocument()
  })
})
