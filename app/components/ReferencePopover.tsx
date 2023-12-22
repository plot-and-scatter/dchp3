import { Popover } from "@headlessui/react"

import { usePopper } from "react-popper"
import { useState } from "react"
import SanitizedTextSpan from "./SanitizedTextSpan"

interface ReferencePopoverProps {
  text: string
}

const ReferencePopover = ({ text }: ReferencePopoverProps) => {
  let [referenceElement, setReferenceElement] = useState<HTMLElement | null>()
  let [popperElement, setPopperElement] = useState<HTMLElement | null>()
  let { styles, attributes } = usePopper(referenceElement, popperElement)

  if (!text) return <></>

  return (
    <Popover className="relative ml-2 inline-block">
      <Popover.Button
        className="text-primary-light focus:border-primary"
        ref={setReferenceElement}
      >
        <i className="fa-regular fa-book-open-cover cursor-pointer hover:text-primary"></i>
      </Popover.Button>

      <Popover.Panel
        ref={setPopperElement}
        style={styles.popper}
        {...attributes.popper}
        className="absolute z-10 w-96 rounded-md border border-amber-500 bg-amber-50 p-3 shadow-lg"
      >
        <div className="grid grid-cols-1">
          <SanitizedTextSpan text={text} />
        </div>
      </Popover.Panel>
    </Popover>
  )
}

export default ReferencePopover
