import { z } from "zod"
import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import { prisma } from "~/db.server"
import { ZCheckboxValueToBoolean } from "../ZCheckboxValueToBoolean"

export const UpdateEditingToolsSchema = z.object({
  entryEditorFormAction: z.literal(EntryEditorFormActionEnum.EDITING_TOOLS),
  headword: z.string(),
  isPublic: ZCheckboxValueToBoolean,
  isLegacy: ZCheckboxValueToBoolean,
})

export async function updateEditingTools(
  data: z.infer<typeof UpdateEditingToolsSchema>
) {
  await prisma.entry.update({
    where: { headword: data.headword },
    data: {
      is_public: data.isPublic,
      is_legacy: data.isLegacy,
    },
  })
}
