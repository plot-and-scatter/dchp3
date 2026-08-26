import { action } from "./insertEntry"
import { insertEntry } from "~/models/entry.server"
import type * as EntryServerModule from "~/models/entry.server"

// The insert action used to call insertEntry() without awaiting it, then
// redirect. Two things followed: the redirect raced the insert, and a rejected
// insert escaped as an unhandled rejection printing a raw Prisma stack trace
// instead of reaching the error boundary. A duplicate headword is the ordinary
// way to hit that, since Entry.headword is unique.

vi.mock("~/db.server", () => ({ prisma: {} }))

vi.mock("~/models/entry.server", async (importOriginal) => ({
  ...(await importOriginal<typeof EntryServerModule>()),
  insertEntry: vi.fn(),
}))

const postHeadword = (headword: string) => {
  const body = new FormData()
  body.append("headword", headword)
  return action({
    request: new Request("http://localhost:3000/insertEntry", {
      method: "POST",
      body,
    }),
    params: {},
    context: {},
  } as unknown as Parameters<typeof action>[0])
}

// Prisma's unique-constraint violation, as thrown by prisma.entry.create.
const duplicateKeyError = Object.assign(new Error("Unique constraint failed"), {
  code: "P2002",
  meta: { modelName: "Entry", target: "det_entries_unique_headword" },
})

beforeEach(() => {
  vi.mocked(insertEntry).mockReset()
})

describe("insertEntry action", () => {
  it("waits for the insert before redirecting", async () => {
    let settled = false
    vi.mocked(insertEntry).mockImplementation(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10))
      settled = true
    })

    const response = (await postHeadword("brand-new-headword")) as Response

    expect(settled).toBe(true)
    expect(response.status).toBe(302)
    expect(response.headers.get("Location")).toBe(
      "/entries/brand-new-headword/edit"
    )
  })

  it("turns a duplicate headword into a 409 the error boundary can render", async () => {
    vi.mocked(insertEntry).mockRejectedValue(duplicateKeyError)

    const thrown = await postHeadword("franktest").catch((error) => error)

    // data() returns a DataWithResponseInit, not a Response. React Router
    // converts a thrown one into an ErrorResponse before the boundary sees it
    // (dataWithResponseInitToErrorResponse), so what the action controls is
    // this shape: the status and the message DefaultErrorBoundary renders as
    // error.data.message.
    expect(thrown.type).toBe("DataWithResponseInit")
    expect(thrown.init?.status).toBe(409)
    expect(thrown.data.message).toContain("franktest")
    expect(thrown.data.message).toContain("already exists")
  })

  it("does not redirect when the insert fails", async () => {
    vi.mocked(insertEntry).mockRejectedValue(duplicateKeyError)

    const thrown = await postHeadword("franktest").catch((error) => error)

    expect(thrown).not.toBeInstanceOf(Response)
    expect(thrown.init?.status).not.toBe(302)
  })

  it("rethrows errors that are not duplicate-key violations", async () => {
    const other = Object.assign(new Error("connection lost"), { code: "P1001" })
    vi.mocked(insertEntry).mockRejectedValue(other)

    await expect(postHeadword("whatever")).rejects.toThrow("connection lost")
  })
})
