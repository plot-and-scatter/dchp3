import { action } from "./edit"
import { handleEditFormAction } from "./handleEditFormAction"
import { headwordConflictError } from "~/services/errors/headwordConflict"

// A headword conflict must come back from the action as data, not as a thrown
// error. Thrown, it reaches the route's ErrorBoundary, which replaces the whole
// editor and discards every other unsaved change on the page.

vi.mock("~/db.server", () => ({ prisma: {} }))
vi.mock("./handleEditFormAction", () => ({ handleEditFormAction: vi.fn() }))
vi.mock("~/models/entry.server", () => ({
  getEntryByHeadword: vi.fn(),
  updateLogEntries: vi.fn(),
}))
vi.mock("~/services/auth/session.server", () => ({
  redirectIfUserLacksEntryEditPermission: vi.fn(),
}))

const submitRename = () => {
  const body = new FormData()
  body.append("entryEditorFormAction", "Update entry")
  body.append("headword", "franktest")
  return action({
    request: new Request(
      "http://localhost:3000/entries/franktest10751/edit",
      { method: "POST", body }
    ),
    params: { headword: "franktest10751" },
    context: {},
  } as unknown as Parameters<typeof action>[0])
}

// No beforeEach mockReset here on purpose. Calling mockReset() on the vi.fn()
// this module factory creates left the mock unable to take a new
// mockImplementation, and the rejection escaped the action's catch. Each test
// sets its own implementation, so there is nothing to reset.
describe("entry edit action, headword conflict", () => {
  it("returns the conflict as data rather than throwing it", async () => {
    // mockImplementation, not mockRejectedValue: the latter builds the
    // rejected promise as soon as it is configured, which vitest reports as an
    // unhandled rejection before the action ever awaits it.
    vi.mocked(handleEditFormAction).mockImplementation(async () => {
      throw headwordConflictError(
        `"franktest10751" can't be renamed to "franktest"`
      )
    })

    const result = (await submitRename()) as {
      type: string
      data: { conflictMessage: string }
      init?: { status?: number }
    }

    expect(result.type).toBe("DataWithResponseInit")
    expect(result.init?.status).toBe(409)
    expect(result.data.conflictMessage).toContain("franktest10751")
  })

  it("still rethrows errors that are not headword conflicts", async () => {
    vi.mocked(handleEditFormAction).mockImplementation(async () => {
      throw new Error("database is on fire")
    })

    await expect(submitRename()).rejects.toThrow("database is on fire")
  })
})
