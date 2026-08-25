import { parseWithZod } from "@conform-to/zod"
import { z } from "zod"
import { CreateReferenceSchema } from "./createReference"
import { DeleteReferenceSchema } from "./deleteReference"
import { ReferenceActionEnum } from "./ReferenceActionEnum"
import { UpdateReferenceSchema } from "./updateReference"

// references/add-reference posts CreateReferenceSchema; references/$id posts a
// discriminated union of update and delete. Both actions throw outright on a
// failed submission, so conform's parse result is the only guard between the
// form and Prisma. These tests pin the discriminator, the strict-mode rejection
// of unknown fields, and ZPositiveInt coercion.

const formData = (entries: Record<string, string>) => {
  const data = new FormData()
  Object.entries(entries).forEach(([key, value]) => data.append(key, value))
  return data
}

// The union used by the references/$id action.
const referenceIdSchema = z.discriminatedUnion("referenceAction", [
  UpdateReferenceSchema,
  DeleteReferenceSchema,
])

describe("CreateReferenceSchema parsed through conform", () => {
  it("accepts a well-formed create submission", () => {
    const submission = parseWithZod(
      formData({
        referenceAction: ReferenceActionEnum.CREATE_REFERENCE,
        shortDisplay: "Avis 1967",
        referenceText: "Avis, Walter S. et al. Dictionary of Canadianisms.",
      }),
      { schema: CreateReferenceSchema }
    )

    expect(submission.status).toBe("success")
    expect(submission.status === "success" && submission.value).toEqual({
      referenceAction: ReferenceActionEnum.CREATE_REFERENCE,
      shortDisplay: "Avis 1967",
      referenceText: "Avis, Walter S. et al. Dictionary of Canadianisms.",
    })
  })

  it("rejects a submission carrying the wrong referenceAction", () => {
    const submission = parseWithZod(
      formData({
        referenceAction: ReferenceActionEnum.DELETE_REFERENCE,
        shortDisplay: "Avis 1967",
        referenceText: "Some text",
      }),
      { schema: CreateReferenceSchema }
    )

    expect(submission.status).toBe("error")
    expect(submission.reply().error).toMatchObject({
      referenceAction: expect.any(Array),
    })
  })

  it("rejects unknown fields, because the schema is strict", () => {
    const submission = parseWithZod(
      formData({
        referenceAction: ReferenceActionEnum.CREATE_REFERENCE,
        shortDisplay: "Avis 1967",
        referenceText: "Some text",
        somethingElse: "unexpected",
      }),
      { schema: CreateReferenceSchema }
    )

    expect(submission.status).toBe("error")
  })

  it("treats an empty referenceText as missing rather than as an empty string", () => {
    // Conform strips empty strings before zod runs, so a blank textarea fails
    // z.string() as "Required" instead of arriving as "".
    const submission = parseWithZod(
      formData({
        referenceAction: ReferenceActionEnum.CREATE_REFERENCE,
        shortDisplay: "Avis 1967",
        referenceText: "",
      }),
      { schema: CreateReferenceSchema }
    )

    expect(submission.status).toBe("error")
    expect(submission.reply().error).toMatchObject({
      referenceText: ["Required"],
    })
  })
})

describe("the references/$id discriminated union parsed through conform", () => {
  it("routes an update submission to the update branch and coerces id", () => {
    const submission = parseWithZod(
      formData({
        referenceAction: ReferenceActionEnum.UPDATE_REFERENCE,
        shortDisplay: "Avis 1967",
        referenceText: "Some text",
        id: "42",
      }),
      { schema: referenceIdSchema }
    )

    expect(submission.status).toBe("success")
    if (submission.status !== "success") return
    expect(submission.value.referenceAction).toBe(
      ReferenceActionEnum.UPDATE_REFERENCE
    )
    expect(submission.value.id).toBe(42)
  })

  it("routes a delete submission to the delete branch", () => {
    const submission = parseWithZod(
      formData({
        referenceAction: ReferenceActionEnum.DELETE_REFERENCE,
        id: "7",
      }),
      { schema: referenceIdSchema }
    )

    expect(submission.status).toBe("success")
    if (submission.status !== "success") return
    expect(submission.value.referenceAction).toBe(
      ReferenceActionEnum.DELETE_REFERENCE
    )
    expect(submission.value.id).toBe(7)
  })

  it("rejects a delete submission carrying update-only fields", () => {
    // DeleteReferenceSchema is strict, so the update branch's fields are not
    // silently ignored when the discriminator says delete.
    const submission = parseWithZod(
      formData({
        referenceAction: ReferenceActionEnum.DELETE_REFERENCE,
        id: "7",
        shortDisplay: "Avis 1967",
      }),
      { schema: referenceIdSchema }
    )

    expect(submission.status).toBe("error")
  })

  it("rejects a non-positive or non-numeric id", () => {
    const ids = ["0", "-3", "abc", ""]

    ids.forEach((id) => {
      const submission = parseWithZod(
        formData({
          referenceAction: ReferenceActionEnum.DELETE_REFERENCE,
          id,
        }),
        { schema: referenceIdSchema }
      )

      // eslint-disable-next-line jest/valid-expect -- vitest supports a message
      expect(submission.status, `id "${id}" should be rejected`).toBe("error")
    })
  })

  it("rejects an unrecognised referenceAction", () => {
    const submission = parseWithZod(
      formData({ referenceAction: "NotAnAction", id: "7" }),
      { schema: referenceIdSchema }
    )

    expect(submission.status).toBe("error")
  })
})
