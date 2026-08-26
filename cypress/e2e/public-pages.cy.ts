// Non-destructive smoke coverage for the pages that survive without a login.
// These read only: no form is submitted and nothing is written.
//
// They exist because the React Router migration changed two things that no
// unit test can see end to end. Single fetch now streams loader data with
// turbo-stream, which preserves real Date objects where the old build sent ISO
// strings, and rendering a Date as a React child throws at runtime. And the
// classic compiler's CSS-URL and route-module handling was replaced by Vite.
// Both failures only show up when a real server renders a real page.

const PUBLIC_PAGES = [
  "/",
  "/about",
  "/acknowledgements",
  "/how-to-use",
  "/references",
  "/search",
  "/entries/browse/c/1",
  "/entries/browse/c/2",
]

describe("public pages respond", () => {
  // cy.request goes straight to the server, so this catches a loader or a
  // server render that blows up, without waiting for the browser to paint.
  PUBLIC_PAGES.forEach((path) => {
    it(`serves ${path}`, () => {
      cy.request(path).its("status").should("eq", 200)
    })
  })
})

describe("public pages render", () => {
  it("renders the entry browse list", () => {
    cy.visitAndCheck("/entries/browse/c/1")
    cy.findByText("Cabbagetown").should("exist")
  })

  it("paginates the browse list without a server error", () => {
    cy.visitAndCheck("/entries/browse/c/2")
    cy.contains("Something went wrong").should("not.exist")
  })

  it("renders the search page", () => {
    cy.visitAndCheck("/search")
    cy.contains("Something went wrong").should("not.exist")
  })
})

// DictionaryVersion reads LogEntry.created, which single fetch now delivers as
// a real Date. Rendering one directly throws "Objects are not valid as a React
// child", so a page that paints its badge at all proves the date path works.
// A dchp1 entry would not do: it returns "pre-1967" before touching a date.
describe("entry detail renders dates from log entries", () => {
  it("shows the DCHP-2 badge with a month and year", () => {
    cy.visitAndCheck("/entries/acclaim")
    cy.contains(/DCHP-2 \([A-Z][a-z]{2} \d{4}\)/).should("exist")
    cy.contains("Objects are not valid as a React child").should("not.exist")
  })

  it("applies the dchp3 log-entry date filter", () => {
    // Hogtown is dchp3, so calculateDictionaryVersion keeps only log entries
    // created after April 2025. It has none -- nor does any public dchp3 entry
    // in the current data -- so the filter empties the list and the badge falls
    // through to "Unknown". That is the point of the assertion: if the filter
    // did not run, the earliest log entry (2010) would survive and the badge
    // would read "DCHP-2 (Oct 2010)" instead.
    cy.visitAndCheck("/entries/Hogtown")
    cy.contains("Unknown (Post-DCHP-1)").should("exist")
    cy.contains("Oct 2010").should("not.exist")
  })

  it("still renders an entry whose version needs no date", () => {
    cy.visitAndCheck("/entries/abatteau")
    cy.contains("DCHP-1 (pre-1967)").should("exist")
  })
})
