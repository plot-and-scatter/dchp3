import { z } from "zod"
import { prisma } from "~/db.server"
import { ZPrimaryKeyInt } from "../ZPrimaryKeyInt"
import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import { ZCheckboxValueToBoolean } from "../ZCheckboxValueToBoolean"

export const UpdateEntrySchema = z.object({
  entryEditorFormAction: z.literal(EntryEditorFormActionEnum.UPDATE_ENTRY),
  entryId: ZPrimaryKeyInt,
  headword: z.string(),
  spellingVariant: z.string(),
  generalLabels: z.string(),
  etymology: z.string(),
  fistNote: z.string(),
  dagger: ZCheckboxValueToBoolean,
  isLegacy: ZCheckboxValueToBoolean,
  isNonCanadian: ZCheckboxValueToBoolean,
})

export async function updateEntry(data: z.infer<typeof UpdateEntrySchema>) {
  await assertNonDuplicateHeadword(data.entryId, data.headword)

  await prisma.entry.update({
    where: { id: data.entryId },
    data,
  })
}

// TODO: Not sure if this is required, or if we can do something clever using
// Prisma to do this for us.
async function assertNonDuplicateHeadword(
  id: number,
  incomingHeadword: string
) {
  const entry = await prisma.entry.findUniqueOrThrow({
    where: { id: id },
    select: { headword: true },
  })

  const currentHeadword = entry.headword
  const incomingHeadwordEntry = await prisma.entry.findUnique({
    where: { headword: incomingHeadword },
  })

  const headwordsAreDifferent = entry.headword !== incomingHeadword
  const newHeadwordWouldBeDuplicate =
    incomingHeadwordEntry !== undefined && incomingHeadwordEntry !== null

  if (headwordsAreDifferent && newHeadwordWouldBeDuplicate) {
    throw new Error(
      `"${currentHeadword}" can't be changed to "${incomingHeadword}" as an Entry for "${incomingHeadword}" already exists`
    )
  }
}
