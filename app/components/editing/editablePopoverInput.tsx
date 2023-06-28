import EditableTextInput from "./editableTextInput"
import EditableTextArea from "./EditableTextArea"

interface Props {
  name: string
  label: string
  value: string | undefined
  type?: editablePopoverInputTypes
}

export enum editablePopoverInputTypes {
  TEXTAREA = "TextArea",
}

const EditablePopoverInput = ({ name, label, value, type }: Props) => {
  value = value ?? ""

  if (type === editablePopoverInputTypes.TEXTAREA) {
    return (
      <label>
        {label} <EditableTextArea name={name} value={value} />
      </label>
    )
  } else {
    return (
      <label>
        {label} <EditableTextInput name={name} value={value} />
      </label>
    )
  }
}

export default EditablePopoverInput
