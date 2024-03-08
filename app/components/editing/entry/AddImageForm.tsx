import Input from "~/components/bank/Input"
import LabelledField from "~/components/bank/LabelledField"
import type { LoadedEntryDataType } from "~/routes/entries/$headword"

type AddImageFormProps = {
  entry: LoadedEntryDataType
}

export default function AddImageForm({ entry }: AddImageFormProps) {
  return (
    <>
      <LabelledField
        breakAfterLabel
        label="Caption"
        field={<Input name="caption" />}
      />
    </>
  )
}
