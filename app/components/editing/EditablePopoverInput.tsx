import EditableTextArea from "./EditableTextArea"
import EditableTextInput from "./EditableTextInput"

interface Props {
  name: string
  label: string
  value: string | undefined
  type?: editablePopoverInputTypes
}

export enum editablePopoverInputTypes {
  TEXTAREA = "TextArea",
  SEEALSO = "SeeAlso",
}

const EditablePopoverInput = ({ name, label, value, type }: Props) => {
  value = value ?? ""

  switch (type) {
    case editablePopoverInputTypes.TEXTAREA:
      return (
        <label>
          {label} <EditableTextArea name={name} value={value} />
        </label>
      )
    case editablePopoverInputTypes.SEEALSO:
      return <></>
    default:
      return (
        <label>
          {label} <EditableTextInput name={name} value={value} />
        </label>
      )
  }
}

export default EditablePopoverInput
