import { Popover } from "@headlessui/react"

import { usePopper } from "react-popper"
import { useState } from "react"
import { Form } from "@remix-run/react"

interface Props {
  first: string
}

const EditingPopover = ({ first }: Props) => {
  let [referenceElement, setReferenceElement] = useState<HTMLElement | null>()
  let [popperElement, setPopperElement] = useState<HTMLElement | null>()
  let { styles, attributes } = usePopper(referenceElement, popperElement)

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
          <Form action="/entries" method="post">
            <label>
              hi!
              <input className="p-2" name="testInput" />
            </label>
          </Form>
        </div>
      </Popover.Panel>
    </Popover>
  )
}

export default EditingPopover
