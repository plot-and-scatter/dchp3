import { sourceTypeToText } from "utils/source"
import Button from "~/components/elements/Button"
import { BankSourceTypeEnum } from "~/models/bank.types"

interface ActiveSourcePickerProps {
  activeSourceType: BankSourceTypeEnum
  setActiveSourceType: (newSourceType: BankSourceTypeEnum) => void
}

export default function ActiveSourcePicker({
  activeSourceType,
  setActiveSourceType,
}: ActiveSourcePickerProps) {
  const buttons = Object.values(BankSourceTypeEnum)
    .filter((enumMember) => Number.isInteger(enumMember))
    .map((sourceType) => {
      return (
        <Button
          key={sourceType}
          appearance={activeSourceType === sourceType ? "primary" : "secondary"}
          onClick={(e) => {
            setActiveSourceType(sourceType as BankSourceTypeEnum)
          }}
          type="button"
        >
          {sourceTypeToText(sourceType as BankSourceTypeEnum)}
        </Button>
      )
    })

  return <div className="flex gap-x-4">{buttons}</div>
}
