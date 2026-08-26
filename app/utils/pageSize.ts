export const DEFAULT_PAGE_SIZE = 100

// The citation bank paginates separately from entry search. The value matches
// DEFAULT_PAGE_SIZE today but is deliberately its own constant. It lives here,
// rather than next to the query in ~/services/bank/searchCitations, because
// client components read it too — and importing it from that module pulled
// ~/db.server into the browser bundle.
export const BANK_CITATION_PAGE_SIZE = 100
