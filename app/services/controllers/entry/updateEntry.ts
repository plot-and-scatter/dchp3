import { z } from "zod"
// Aliased: updateEntry below takes a parameter named `data`.
import { data as errorResponse } from "react-router"
import { prisma } from "~/db.server"
import { ZPositiveInt } from "../ZPositiveInt"
import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import { ZCheckboxValueToBoolean } from "../ZCheckboxValueToBoolean"
import { ZOptionalStringToEmptyString } from "../ZOptionalStringToEmptyString"

export const UpdateEntrySchema = z
  .object({
    entryEditorFormAction: z.literal(EntryEditorFormActionEnum.UPDATE_ENTRY),
    entryId: ZPositiveInt,
    headword: z.string(),
    spellingVariant: ZOptionalStringToEmptyString,
    generalLabels: ZOptionalStringToEmptyString,
    etymology: ZOptionalStringToEmptyString,
    fistNote: ZOptionalStringToEmptyString,
    dagger: ZCheckboxValueToBoolean,
    isLegacy: ZCheckboxValueToBoolean,
    isNonCanadian: ZCheckboxValueToBoolean,
    dchpVersion: z.enum(["dchp1", "dchp2", "dchp3", "dchp3.1"]),
  })
  .strict()

export async function updateEntry(data: z.infer<typeof UpdateEntrySchema>) {
  await assertNonDuplicateHeadword(data.entryId, data.headword)

  await prisma.entry.update({
    where: { id: data.entryId },
    data: {
      headword: data.headword,
      spelling_variants: data.spellingVariant,
      general_labels: data.generalLabels,
      etymology: data.etymology,
      fist_note: data.fistNote,
      dagger: data.dagger,
      is_legacy: data.isLegacy,
      no_cdn_conf: data.isNonCanadian,
      dchp_version: data.dchpVersion,
    },
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
    // Thrown as a 409 rather than a bare Error so the error boundary shows the
    // editor a sentence it can act on. A bare Error renders as a 500 with a
    // stack trace, which is what this used to do.
    throw errorResponse(
      {
        message: `"${currentHeadword}" can't be renamed to "${incomingHeadword}", because an entry for "${incomingHeadword}" already exists. Headwords must be unique.`,
      },
      { status: 409 }
    )
  }
}
