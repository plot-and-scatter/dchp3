import { z } from "zod"
import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import { prisma } from "~/db.server"
import { ZCheckboxValueToBoolean } from "../ZCheckboxValueToBoolean"
import { ZPositiveInt } from "../ZPositiveInt"

export const UpdateEditingToolsSchema = z
  .object({
    entryEditorFormAction: z.literal(EntryEditorFormActionEnum.EDITING_TOOLS),
    entryId: ZPositiveInt,
    isPublic: ZCheckboxValueToBoolean,
  })
  .strict()

export async function updateEditingTools(
  data: z.infer<typeof UpdateEditingToolsSchema>
) {
  await prisma.entry.update({
    where: { id: data.entryId },
    data: {
      is_public: data.isPublic,
    },
  })
}
