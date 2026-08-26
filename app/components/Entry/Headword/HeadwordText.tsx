import { Fragment } from "react"
import Input from "../../bank/Input"
import TopLabelledField from "../../bank/TopLabelledField"

type HeadwordTextProps = {
  headword: string
  isEditingMode?: boolean
}

export default function HeadwordText({
  headword,
  isEditingMode,
}: HeadwordTextProps) {
  if (!isEditingMode) return <Fragment>{headword}</Fragment>

  return (
    <TopLabelledField
      label={<div className="text-base">Headword</div>}
      field={<Input lightBorder name="headword" defaultValue={headword} />}
    />
  )
}
