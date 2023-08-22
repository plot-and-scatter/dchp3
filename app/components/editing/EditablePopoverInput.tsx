import AddSeeAlsoInput from "./AddSeeAlsoInput"
import ConfirmationInput from "./ConfirmationInput"
import EditableTextArea from "./EditableTextArea"
import EditableTextInput from "./EditableTextInput"

interface Props {
  name: string
  value: string | undefined
  type?: editablePopoverInputTypes
}

export enum editablePopoverInputTypes {
  TEXTAREA = "TextArea",
  SEE_ALSO = "SeeAlso",
  DELETE = "DELETE",
}

const EditablePopoverInput = ({ name, value, type }: Props) => {
  value = value ?? ""

  switch (type) {
    case editablePopoverInputTypes.TEXTAREA:
      return <EditableTextArea name={name} value={value} />
    case editablePopoverInputTypes.SEE_ALSO:
      return <AddSeeAlsoInput />
    case editablePopoverInputTypes.DELETE:
      return <ConfirmationInput />
    default:
      return <EditableTextInput name={name} value={value} />
  }
}

export default EditablePopoverInput
