import {
  FREQUENCY_DRAFT_KEY,
  clearDraft,
  draftHasWork,
  readDraft,
  writeDraft,
} from "./frequencyIndexDraft"

const draft = {
  term: "toque",
  normalizer: "the",
  exclusions: "",
  multiplier: 10_000,
  snapshot: { term: "toque", normalizer: "the", exclusions: "" },
  rows: {
    ca: {
      termHits: "120",
      normalizerHits: "",
      normalizerCountId: null,
      reusedFrom: null,
    },
  },
}

beforeEach(() => window.localStorage.clear())

describe("frequency index draft", () => {
  it("round-trips through localStorage with a timestamp", () => {
    writeDraft(draft)
    const read = readDraft()
    expect(read).toMatchObject(draft)
    expect(typeof read?.savedAt).toBe("string")
  })

  it("is null when nothing is stored or the value is garbage", () => {
    expect(readDraft()).toBeNull()
    window.localStorage.setItem(FREQUENCY_DRAFT_KEY, "{not json")
    expect(readDraft()).toBeNull()
    window.localStorage.setItem(
      FREQUENCY_DRAFT_KEY,
      JSON.stringify({ term: 1 })
    )
    expect(readDraft()).toBeNull()
  })

  it("clears", () => {
    writeDraft(draft)
    clearDraft()
    expect(readDraft()).toBeNull()
  })

  it("only counts a draft as work once a table exists and a count was typed", () => {
    expect(draftHasWork({ ...draft, savedAt: "" })).toBe(true)
    expect(draftHasWork({ ...draft, savedAt: "", snapshot: null })).toBe(false)
    const empty = { ca: { ...draft.rows.ca, termHits: "" } }
    expect(draftHasWork({ ...draft, savedAt: "", rows: empty })).toBe(false)
  })
})
