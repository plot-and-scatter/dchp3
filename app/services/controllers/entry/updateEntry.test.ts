import { updateEntry } from "./updateEntry"
import { prisma } from "~/db.server"

// Renaming an entry to a headword that already exists used to throw a bare
// Error, which the boundary rendered as a 500 with a stack trace. It is now a
// 409 carrying a sentence the editor can act on.

vi.mock("~/db.server", () => ({
  prisma: {
    entry: {
      findUniqueOrThrow: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}))

const submission = (headword: string) =>
  ({
    entryEditorFormAction: "Update entry",
    entryId: 1,
    headword,
    spellingVariant: "",
    generalLabels: "",
    etymology: "",
    fistNote: "",
    dagger: false,
    isLegacy: false,
    isNonCanadian: false,
    dchpVersion: "dchp3.1",
  }) as unknown as Parameters<typeof updateEntry>[0]

beforeEach(() => {
  vi.mocked(prisma.entry.findUniqueOrThrow).mockReset()
  vi.mocked(prisma.entry.findUnique).mockReset()
  vi.mocked(prisma.entry.update).mockReset()
})

describe("updateEntry duplicate headword handling", () => {
  it("refuses a rename onto an existing headword with a 409", async () => {
    vi.mocked(prisma.entry.findUniqueOrThrow).mockResolvedValue({
      headword: "franktest10751",
    } as never)
    vi.mocked(prisma.entry.findUnique).mockResolvedValue({
      id: 99,
      headword: "franktest",
    } as never)

    const thrown = await updateEntry(submission("franktest")).catch((e) => e)

    expect(thrown.type).toBe("DataWithResponseInit")
    expect(thrown.init?.status).toBe(409)
    expect(thrown.data.message).toContain("franktest10751")
    expect(thrown.data.message).toContain("already exists")
    expect(prisma.entry.update).not.toHaveBeenCalled()
  })

  it("allows a rename to a headword nothing else uses", async () => {
    vi.mocked(prisma.entry.findUniqueOrThrow).mockResolvedValue({
      headword: "franktest10751",
    } as never)
    vi.mocked(prisma.entry.findUnique).mockResolvedValue(null as never)

    await updateEntry(submission("a-brand-new-headword"))

    expect(prisma.entry.update).toHaveBeenCalledOnce()
  })

  it("allows saving an entry without changing its headword", async () => {
    vi.mocked(prisma.entry.findUniqueOrThrow).mockResolvedValue({
      headword: "franktest10751",
    } as never)
    // The entry's own row comes back here, which must not count as a duplicate.
    vi.mocked(prisma.entry.findUnique).mockResolvedValue({
      id: 1,
      headword: "franktest10751",
    } as never)

    await updateEntry(submission("franktest10751"))

    expect(prisma.entry.update).toHaveBeenCalledOnce()
  })
})
