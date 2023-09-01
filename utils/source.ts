import type { BankSourceTypeEnum } from "~/models/bank.types"

export function sourceTypeToText(
  sourceType: BankSourceTypeEnum | undefined | null
): string {
  switch (sourceType) {
    case 0:
      return "Book"
    case 1:
      return "Periodical"
    case 2:
      return "Site/Flier"
    case 3:
      return "Spoken Language"
  }
  return "Unknown Source"
}
