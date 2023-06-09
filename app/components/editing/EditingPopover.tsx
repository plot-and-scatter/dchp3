import { Popover } from "@headlessui/react"
import { usePopper } from "react-popper"
import { useState } from "react"
import { Form } from "@remix-run/react"
import { type attributeEnum } from "./attributeEnum"
import EditablePopoverInput, {
  type editablePopoverInputTypes,
} from "./EditablePopoverInput"

interface Props {
  headword: string
  currentValue: string | undefined
  attributeType: attributeEnum
  attributeID: number
  type?: editablePopoverInputTypes
}

const EditingPopover = ({
  headword,
  currentValue,
  attributeType,
  attributeID,
  type,
}: Props) => {
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>()
  const [popperElement, setPopperElement] = useState<HTMLElement | null>()
  const { styles, attributes } = usePopper(referenceElement, popperElement)

  return (
    <Popover className="relative ml-2 inline-block">
      <Popover.Button
        className="text-red-400 focus:border-red-600"
        ref={setReferenceElement}
      >
        <i className="fa-solid fa-pen-to-square cursor-pointer hover:text-red-600"></i>
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
              label="input: "
              type={type}
            />
            <input type="hidden" name="attributeType" value={attributeType} />
            <input type="hidden" name="attributeID" value={attributeID} />
          </Form>
        </div>
      </Popover.Panel>
    </Popover>
  )
}

export default EditingPopover
