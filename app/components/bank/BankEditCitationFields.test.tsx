import { render, screen } from "@testing-library/react"
import BankEditCitationFields from "./BankEditCitationFields"
import type { BankEditCitationFieldsProps } from "./BankEditCitationFields"

// Under the classic compiler, loader data reached the browser as JSON, so
// BankCitation's `created` and `last_modified` arrived as ISO strings and
// rendered as-is. React Router's single fetch streams them with turbo-stream,
// which preserves real Dates -- and rendering a Date as a React child throws
// "Objects are not valid as a React child", which is what the citation edit
// screen did after the migration.
//
// TypeScript cannot catch this: it does not check fragment children against
// ReactNode, so `<>{someDate}</>` type-checks cleanly. These tests are the
// only guard.

const citation = {
  id: 7,
  created: new Date("2024-04-26T14:23:11.000Z"),
  last_modified: new Date("2025-01-02T09:00:00.000Z"),
  creator: { email: "editor@dchp.ca" },
  headword: { headword: "toque" },
  short_meaning: "a knitted hat",
  spelling_variant: null,
  part_of_speech: null,
  memo: null,
} as unknown as BankEditCitationFieldsProps["citation"]

describe("BankEditCitationFields date rendering", () => {
  it("renders a citation whose dates are real Date objects", () => {
    expect(() =>
      render(<BankEditCitationFields citation={citation} />)
    ).not.toThrow()
  })

  it("shows the dates in the same ISO form the JSON build produced", () => {
    render(<BankEditCitationFields citation={citation} />)

    expect(
      screen.getByText(/2024-04-26T14:23:11\.000Z/)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/2025-01-02T09:00:00\.000Z/)
    ).toBeInTheDocument()
  })

  it("omits a null date rather than rendering the string 'null'", () => {
    render(
      <BankEditCitationFields
        citation={
          {
            ...citation,
            created: null,
            last_modified: null,
          } as unknown as BankEditCitationFieldsProps["citation"]
        }
      />
    )

    expect(screen.queryByText(/null/)).not.toBeInTheDocument()
  })
})
