import { Popover } from "@headlessui/react"
import { usePopper } from "react-popper"
import { useState } from "react"
import { Form, useParams } from "@remix-run/react"
import { type attributeEnum } from "./attributeEnum"
import EditablePopoverInput, {
  type editablePopoverInputTypes,
} from "./EditablePopoverInput"

interface Props {
  headword?: string
  currentValue?: string
  attributeType: attributeEnum
  attributeID: number
  type?: editablePopoverInputTypes
  buttonLabel?: React.ReactNode
  icon?: "delete" | "edit" | "add"
  children?: React.ReactNode
}

function getIcon(icon: string | undefined) {
  switch (icon) {
    case "delete":
      return "fa-solid fa-trash fa-xs"
    case "edit":
      return "fa-solid fa-pen-to-square"
    case "add":
      return "fa-solid fa-circle-plus fa-sm"
    default:
      return "fa-solid fa-pen-to-square"
  }
}

const EditingPopover = ({
  currentValue,
  attributeType,
  attributeID,
  type,
  icon,
  buttonLabel,
  children: formChildren,
}: Props) => {
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>()
  const [popperElement, setPopperElement] = useState<HTMLElement | null>()
  const { styles, attributes } = usePopper(referenceElement, popperElement)

  const params = useParams()
  const headword = params.headword

  return (
    <Popover className="relative ml-2 inline-block">
      <Popover.Button
        className={`text-red-400 focus:border-red-600`}
        ref={setReferenceElement}
      >
        <div className="flex flex-row items-center">
          <p>{buttonLabel}</p>
          <i
            className={`${getIcon(
              icon
            )} mx-2 mb-4 cursor-pointer hover:text-red-600`}
          ></i>
        </div>
      </Popover.Button>

      <Popover.Panel
        ref={setPopperElement}
        style={styles.popper}
        {...attributes.popper}
        className="absolute z-10 w-96 rounded-md border border-amber-500 bg-amber-50 p-3 shadow-lg"
      >
        <div className="grid grid-cols-1">
          <Form
            reloadDocument={true} // reloading to kill popper on post
            action={`/entries/${headword}`}
            method="post"
          >
            <EditablePopoverInput
              name="newValue"
              value={currentValue ?? ""}
              type={type}
            />
            {formChildren}
            <input type="hidden" name="attributeType" value={attributeType} />
            <input type="hidden" name="attributeID" value={attributeID} />
          </Form>
        </div>
      </Popover.Panel>
    </Popover>
  )
}

export default EditingPopover
