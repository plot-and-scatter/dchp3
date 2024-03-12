import SanitizedTextSpan from "~/components/Entry/Common/SanitizedTextSpan"
import type { MeaningType } from "./Meaning"
import LabelledField from "../../bank/LabelledField"
import Input from "../../bank/Input"

interface DefinitionProps {
  meaning: MeaningType
  isEditingMode?: boolean
}

const Definition = ({ meaning, isEditingMode }: DefinitionProps) => {
  if (!isEditingMode) {
    return (
      <p className="mb-4 text-sm font-bold text-gray-500 md:text-xl">
        <SanitizedTextSpan text={meaning.definition} />
      </p>
    )
  }

  return (
    <LabelledField
      label={`Definition`}
      breakAfterLabel
      field={
        <Input
          name="definition"
          defaultValue={meaning.definition}
          lightBorder
          className="font-bold md:text-xl"
          placeholder="Enter definition"
        />
      }
    />
  )
}

export default Definition
