import { handleEditFormAction } from "./handleEditFormAction"
import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import { updateEditingComment } from "~/services/controllers/entry/updateEditingComment"
import { deleteQuotation } from "~/services/controllers/entry/deleteQuotation"
import { addSeeAlso } from "~/services/controllers/meaning/addSeeAlso"
import { addReferenceLink } from "~/services/controllers/entry/addReferenceLink"
import type * as UpdateEditingCommentModule from "~/services/controllers/entry/updateEditingComment"
import type * as DeleteQuotationModule from "~/services/controllers/entry/deleteQuotation"
import type * as AddSeeAlsoModule from "~/services/controllers/meaning/addSeeAlso"
import type * as AddReferenceLinkModule from "~/services/controllers/entry/addReferenceLink"

// Every entry-editor form posts into this one action, which parses the body
// against a nineteen-branch discriminated union and dispatches on the
// entryEditorFormAction discriminator. The parse is the only thing standing
// between a form post and a Prisma write, so these tests pin the dispatch, the
// coercion of id fields, and the refusal of malformed submissions.

vi.mock("~/db.server", () => ({ prisma: {} }))

// Keep each controller's real schema (the union is built from them) but stub
// the write so nothing reaches Prisma.
vi.mock(
  "~/services/controllers/entry/updateEditingComment",
  async (original) => ({
    ...(await original<typeof UpdateEditingCommentModule>()),
    updateEditingComment: vi.fn(),
  })
)
vi.mock("~/services/controllers/entry/deleteQuotation", async (original) => ({
  ...(await original<typeof DeleteQuotationModule>()),
  deleteQuotation: vi.fn(),
}))
vi.mock("~/services/controllers/meaning/addSeeAlso", async (original) => ({
  ...(await original<typeof AddSeeAlsoModule>()),
  addSeeAlso: vi.fn(),
}))
vi.mock("~/services/controllers/entry/addReferenceLink", async (original) => ({
  ...(await original<typeof AddReferenceLinkModule>()),
  addReferenceLink: vi.fn(),
}))

const formData = (entries: Record<string, string>) => {
  const data = new FormData()
  Object.entries(entries).forEach(([key, value]) => data.append(key, value))
  return data
}

describe("handleEditFormAction", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("dispatches a comment submission and coerces entryId to a number", async () => {
    await handleEditFormAction(
      formData({
        entryEditorFormAction: EntryEditorFormActionEnum.COMMENT,
        entryId: "123",
        comment: "Needs a second look",
      })
    )

    expect(updateEditingComment).toHaveBeenCalledTimes(1)
    expect(updateEditingComment).toHaveBeenCalledWith({
      entryEditorFormAction: EntryEditorFormActionEnum.COMMENT,
      entryId: 123,
      comment: "Needs a second look",
    })
  })

  it("turns an omitted optional string into an empty string, not undefined", async () => {
    await handleEditFormAction(
      formData({
        entryEditorFormAction: EntryEditorFormActionEnum.COMMENT,
        entryId: "123",
      })
    )

    expect(updateEditingComment).toHaveBeenCalledWith(
      expect.objectContaining({ comment: "" })
    )
  })

  it("dispatches a delete-citation submission to deleteQuotation alone", async () => {
    await handleEditFormAction(
      formData({
        entryEditorFormAction: EntryEditorFormActionEnum.DELETE_QUOTATION,
        meaningId: "12",
        citationId: "34",
      })
    )

    expect(deleteQuotation).toHaveBeenCalledWith({
      entryEditorFormAction: EntryEditorFormActionEnum.DELETE_QUOTATION,
      meaningId: 12,
      citationId: 34,
    })
    expect(updateEditingComment).not.toHaveBeenCalled()
  })

  it("assembles the see-also headword from its dot-named form fields", async () => {
    // The headword Combobox posts headword.label and headword.value; conform
    // folds those into a single object for the schema.
    //
    // These names matter beyond tidiness. Headless UI's own serialisation
    // would post headword[label] and headword[value], and conform reads
    // square brackets as array indices -- it finds a word rather than a
    // number, discards both fields, and the save fails as "Required". If this
    // test starts failing, check whether Combobox has gone back to letting
    // Headless UI name these inputs.
    await handleEditFormAction(
      formData({
        entryEditorFormAction: EntryEditorFormActionEnum.ADD_SEE_ALSO,
        meaningId: "12",
        "headword.label": "toque",
        "headword.value": "99",
        linkNote: "see also",
      })
    )

    expect(addSeeAlso).toHaveBeenCalledWith({
      entryEditorFormAction: EntryEditorFormActionEnum.ADD_SEE_ALSO,
      meaningId: 12,
      headword: { label: "toque", value: 99 },
      linkNote: "see also",
    })
  })

  it("assembles the reference link the same way", async () => {
    await handleEditFormAction(
      formData({
        entryEditorFormAction: EntryEditorFormActionEnum.ADD_REFERENCE_LINK,
        entryId: "5",
        "referenceId.label": "Avis 1967",
        "referenceId.value": "17",
        linkText: "Transportation: The Canoe",
        linkTarget: "https://example.test/canoe",
      })
    )

    expect(addReferenceLink).toHaveBeenCalledWith({
      entryEditorFormAction: EntryEditorFormActionEnum.ADD_REFERENCE_LINK,
      entryId: 5,
      referenceId: { label: "Avis 1967", value: 17 },
      linkText: "Transportation: The Canoe",
      linkTarget: "https://example.test/canoe",
    })
  })

  it("refuses a see-also submission with no headword chosen", async () => {
    // An untouched Combobox posts empty strings, which conform treats as
    // absent -- so this has to fail rather than write a null entry_id.
    await expect(
      handleEditFormAction(
        formData({
          entryEditorFormAction: EntryEditorFormActionEnum.ADD_SEE_ALSO,
          meaningId: "12",
          "headword.label": "",
          "headword.value": "",
          linkNote: "",
        })
      )
    ).rejects.toThrow(/Error with submission/)

    expect(addSeeAlso).not.toHaveBeenCalled()
  })

  it("returns the successful submission to the caller", async () => {
    const submission = await handleEditFormAction(
      formData({
        entryEditorFormAction: EntryEditorFormActionEnum.COMMENT,
        entryId: "123",
        comment: "ok",
      })
    )

    expect(submission.status).toBe("success")
  })

  it("throws and writes nothing when a required field is missing", async () => {
    await expect(
      handleEditFormAction(
        formData({
          entryEditorFormAction: EntryEditorFormActionEnum.DELETE_QUOTATION,
          meaningId: "12",
        })
      )
    ).rejects.toThrow(/Error with submission/)

    expect(deleteQuotation).not.toHaveBeenCalled()
  })

  it("throws when an id field is not a positive integer", async () => {
    await expect(
      handleEditFormAction(
        formData({
          entryEditorFormAction: EntryEditorFormActionEnum.COMMENT,
          entryId: "0",
          comment: "ok",
        })
      )
    ).rejects.toThrow(/Error with submission/)

    expect(updateEditingComment).not.toHaveBeenCalled()
  })

  it("throws when the discriminator matches no branch of the union", async () => {
    await expect(
      handleEditFormAction(
        formData({ entryEditorFormAction: "Not a real action", entryId: "1" })
      )
    ).rejects.toThrow(/Error with submission/)
  })
})
