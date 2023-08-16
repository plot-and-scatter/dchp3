import { sourceTypeToText } from "utils/source"
import Button from "~/components/elements/Button"
import { SourceTypeEnum } from "~/models/bank.types"

interface ActiveSourcePickerProps {
  activeSourceType: SourceTypeEnum
  setActiveSourceType: (newSourceType: SourceTypeEnum) => void
}

export default function ActiveSourcePicker({
  activeSourceType,
  setActiveSourceType,
}: ActiveSourcePickerProps) {
  const buttons = Object.values(SourceTypeEnum)
    .filter((enumMember) => Number.isInteger(enumMember))
    .map((sourceType) => {
      return (
        <Button
          key={sourceType}
          appearance={activeSourceType === sourceType ? "primary" : "secondary"}
        >
          {sourceTypeToText(sourceType as SourceTypeEnum)}
        </Button>
      )
    })

  return <div className="flex gap-x-4">{buttons}</div>
}
