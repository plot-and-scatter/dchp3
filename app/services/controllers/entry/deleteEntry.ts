import { z } from "zod"
import { prisma } from "~/db.server"
import { ZPositiveInt } from "../ZPositiveInt"
import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"

export const DeleteEntrySchema = z
  .object({
    entryEditorFormAction: z.literal(EntryEditorFormActionEnum.DELETE_ENTRY),
    entryId: ZPositiveInt,
  })
  .strict()

export async function deleteEntry(data: z.infer<typeof DeleteEntrySchema>) {
  // TODO: Assert the user has the privileges to do this.

  await prisma.entry.delete({
    where: { id: data.entryId },
  })
}
