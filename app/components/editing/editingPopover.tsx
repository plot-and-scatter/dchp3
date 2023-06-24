import { Popover } from "@headlessui/react"
import { usePopper } from "react-popper"
import { useEffect, useRef, useState } from "react"
import { Form } from "@remix-run/react"
import { type attributeEnum } from "./attributeEnum"

interface Props {
  headword: string
  attributeType: attributeEnum
  attributeID: number
}

const EditingPopover = ({ headword, attributeType, attributeID }: Props) => {
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>()
  const [popperElement, setPopperElement] = useState<HTMLElement | null>()
  const inputElement = useRef<HTMLInputElement>(null)
  const { styles, attributes } = usePopper(referenceElement, popperElement)

  useEffect(() => {
    inputElement?.current?.focus()
  }, [attributes.popper]) // TODO: Choose specific attribute
  return (
    <Popover className="relative ml-2 inline-block">
      <Popover.Button
        className="text-red-400 focus:border-red-600"
        ref={setReferenceElement}
      >
        <i className="fa-regular fa-book-open-cover cursor-pointer hover:text-red-600"></i>
      </Popover.Button>

      <Popover.Panel
        ref={setPopperElement}
        style={styles.popper}
        {...attributes.popper}
        className="absolute z-10 w-96 rounded-md border border-amber-500 bg-amber-50 p-3 shadow-lg"
      >
        <div className="grid grid-cols-1">
          <Form
            reloadDocument={true} // TODO: reloading to kill popper on post
            action={`/entries/${headword}`}
            method="post"
          >
            <label>
              hi!
              <input ref={inputElement} className="p-2" name="newValue" />
            </label>
            <input type="hidden" name="attributeType" value={attributeType} />
            <input type="hidden" name="attributeID" value={attributeID} />
          </Form>
        </div>
      </Popover.Panel>
    </Popover>
  )
}

export default EditingPopover
