import { prisma } from "~/db.server"
import {
  getCheckboxValueAsBoolean,
  getStringFromFormInput,
} from "~/utils/generalUtils"

export async function updateEditingTools(data: {
  [k: string]: FormDataEntryValue
}) {
  const headword = getStringFromFormInput(data.headword)
  const isPublic = getCheckboxValueAsBoolean(data.isPublic)
  const isLegacy = getCheckboxValueAsBoolean(data.isLegacy)

  await prisma.entry.update({
    where: {
      headword: headword,
    },
    data: {
      is_public: isPublic,
      is_legacy: isLegacy,
    },
  })
}
