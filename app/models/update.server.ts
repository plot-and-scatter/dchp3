import { attributeEnum } from "~/components/editing/attributeEnum"
import { prisma } from "~/db.server"
import { assertIsValidId } from "~/utils/numberUtils"

const ENTRY_TYPE_MAP = {
  [attributeEnum.HEADWORD]: "headword",
  [attributeEnum.ETYMOLOGY]: "etymology",
  [attributeEnum.LABELS]: "general_labels",
  [attributeEnum.SPELLING_VARIANT]: "spelling_variants",
  [attributeEnum.FIST_NOTE]: "fist_note",
  [attributeEnum.DAGGER]: "dagger",
}

export async function updateRecordByAttributeAndType(
  type: attributeEnum,
  id: number,
  value: string
) {
  assertIsValidId(id)
  await updateEntry(id, type, value)
}

async function updateEntry(
  entryId: number,
  type: attributeEnum,
  newValue: string
) {
  await prisma.entry.update({
    where: { id: entryId },
    data: { [ENTRY_TYPE_MAP[type]]: newValue },
  })
}
