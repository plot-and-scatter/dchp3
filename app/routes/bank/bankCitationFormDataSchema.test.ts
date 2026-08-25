import { parseWithZod } from "@conform-to/zod"
import { bankCitationFormDataSchema } from "./create"

// bankCitationFormDataSchema is shared by bank/create and bank/edit/$citationId.
// Both routes hand raw FormData to parseWithZod and then use submission.value
// straight as Prisma input, so conform's coercion layer -- not the zod schema
// alone -- is what turns form strings into numbers and nulls. These tests pin
// that behaviour so a conform upgrade can't silently change it.

// Importing the route pulls in ~/db.server, which builds a real PrismaClient
// at import time and needs DATABASE_URL. CI has no .env, so leaving this
// unmocked crashes the run even though every assertion here is offline.
vi.mock("~/db.server", () => ({ prisma: {} }))

const formData = (entries: Record<string, string>) => {
  const data = new FormData()
  Object.entries(entries).forEach(([key, value]) => data.append(key, value))
  return data
}

// The schema's required fields. Anything not listed here is nullish.
const requiredFields = {
  "citation.headword": "toque",
  "citation.clip_start": "0",
  "citation.clip_end": "10",
  "citation.legacy_id": "0",
  "source.type_id": "1",
}

describe("bankCitationFormDataSchema parsed through conform", () => {
  it("nests dot-notation field names into citation and source objects", () => {
    const submission = parseWithZod(formData(requiredFields), {
      schema: bankCitationFormDataSchema,
    })

    expect(submission.status).toBe("success")
    expect(
      submission.status === "success" && submission.value.citation
    ).toEqual(expect.objectContaining({ headword: "toque" }))
    expect(submission.status === "success" && submission.value.source).toEqual(
      expect.objectContaining({ type_id: 1 })
    )
  })

  it("coerces numeric form strings to numbers", () => {
    const submission = parseWithZod(
      formData({
        ...requiredFields,
        "citation.clip_start": "5",
        "citation.clip_end": "25",
        "citation.legacy_id": "9001",
        "source.type_id": "3",
      }),
      { schema: bankCitationFormDataSchema }
    )

    expect(submission.status).toBe("success")
    if (submission.status !== "success") return
    expect(submission.value.citation.clip_start).toBe(5)
    expect(submission.value.citation.clip_end).toBe(25)
    expect(submission.value.citation.legacy_id).toBe(9001)
    expect(submission.value.source.type_id).toBe(3)
  })

  it("turns empty and absent optional fields into null, not empty strings", () => {
    const submission = parseWithZod(
      formData({
        ...requiredFields,
        "citation.clipped_text": "",
        "citation.memo": "",
        "source.publisher": "",
        author: "",
      }),
      { schema: bankCitationFormDataSchema }
    )

    expect(submission.status).toBe("success")
    if (submission.status !== "success") return
    // Submitted empty
    expect(submission.value.citation.clipped_text).toBeNull()
    expect(submission.value.citation.memo).toBeNull()
    expect(submission.value.source.publisher).toBeNull()
    expect(submission.value.author).toBeNull()
    // Never submitted at all
    expect(submission.value.citation.text).toBeNull()
    expect(submission.value.source.url).toBeNull()
    expect(submission.value.place).toBeNull()
    expect(submission.value.title).toBeNull()
  })

  it("preserves non-empty optional strings", () => {
    const submission = parseWithZod(
      formData({
        ...requiredFields,
        "citation.memo": "a memo",
        "source.publisher": "A Publisher",
        author: "An Author",
        place: "Vancouver",
        title: "A Title",
      }),
      { schema: bankCitationFormDataSchema }
    )

    expect(submission.status).toBe("success")
    if (submission.status !== "success") return
    expect(submission.value.citation.memo).toBe("a memo")
    expect(submission.value.source.publisher).toBe("A Publisher")
    expect(submission.value.author).toBe("An Author")
    expect(submission.value.place).toBe("Vancouver")
    expect(submission.value.title).toBe("A Title")
  })

  it('maps is_incomplete "true" to 1 and anything else to null', () => {
    const parse = (value?: string) =>
      parseWithZod(
        formData(
          value === undefined
            ? requiredFields
            : { ...requiredFields, "citation.is_incomplete": value }
        ),
        { schema: bankCitationFormDataSchema }
      )

    const trueSubmission = parse("true")
    expect(
      trueSubmission.status === "success" &&
        trueSubmission.value.citation.is_incomplete
    ).toBe(1)

    const falseSubmission = parse("false")
    expect(
      falseSubmission.status === "success" &&
        falseSubmission.value.citation.is_incomplete
    ).toBeNull()

    const absentSubmission = parse()
    expect(
      absentSubmission.status === "success" &&
        absentSubmission.value.citation.is_incomplete
    ).toBeNull()
  })

  it("rejects an empty headword with a field-keyed error", () => {
    const submission = parseWithZod(
      formData({ ...requiredFields, "citation.headword": "" }),
      { schema: bankCitationFormDataSchema }
    )

    expect(submission.status).toBe("error")
    const reply = submission.reply()
    expect(reply.status).toBe("error")
    // Note the message is "Required", not the schema's own "Headword must be
    // at least one character long": conform strips empty strings to undefined
    // before zod runs, so an empty headword reads as missing rather than as a
    // min(1) violation, and the custom message is unreachable from the form.
    expect(reply.error).toMatchObject({
      "citation.headword": ["Required"],
    })
  })

  it("reports a wholly empty submission against each missing field", () => {
    const submission = parseWithZod(formData({}), {
      schema: bankCitationFormDataSchema,
    })

    expect(submission.status).toBe("error")
    // Errors are keyed by the field's own name, so the form can render each
    // one against the input it belongs to. (Conform 1.0.4 reported these at
    // the parent instead -- just "citation" and "source" -- which gave the
    // form nothing specific to attach a message to.)
    expect(Object.keys(submission.reply().error ?? {})).toEqual(
      expect.arrayContaining([
        "citation.headword",
        "citation.clip_start",
        "citation.clip_end",
        "citation.legacy_id",
        "source.type_id",
      ])
    )
  })

  it("keeps unknown fields out of value but available on payload", () => {
    // bank/edit/$citationId reads submission.payload.buttonIntent to decide
    // whether the submit was a delete, so raw payload access has to keep working.
    const submission = parseWithZod(
      formData({ ...requiredFields, buttonIntent: "delete" }),
      { schema: bankCitationFormDataSchema }
    )

    expect(submission.status).toBe("success")
    expect(submission.payload).toMatchObject({ buttonIntent: "delete" })
    expect(
      submission.status === "success" && "buttonIntent" in submission.value
    ).toBe(false)
  })
})
