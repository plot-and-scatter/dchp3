import { Popover } from "@headlessui/react"
import { usePopper } from "react-popper"
import { useState } from "react"
import { Form, useParams } from "@remix-run/react"

interface Props {
  meaningId: number
}

const SeeAlsoAdder = ({ meaningId }: Props) => {
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>()
  const [popperElement, setPopperElement] = useState<HTMLElement | null>()
  const { styles, attributes } = usePopper(referenceElement, popperElement)

  const params = useParams()
  const headword = params.headword

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
        <div className="flex flex-col">
          <Form
            reloadDocument={true} // reloading to kill popper on post
            action={`/entries/${headword}`}
            method="post"
          >
            <div className="grid grid-cols-5 grid-rows-2 gap-1">
              <label className="col-span-2" htmlFor="headword">
                Headword:
              </label>
              <input
                type="text"
                name="headword"
                className="col-span-3 border-2 p-1"
              />
              <label className="col-span-2" htmlFor="headword">
                Note:
              </label>
              <input
                type="text"
                name="linkNote"
                className="col-span-3 border-2 p-1"
              />
              <input type="hidden" name="attributeType" value={headword} />
              <button type="submit"></button>
            </div>
          </Form>
        </div>
      </Popover.Panel>
    </Popover>
  )
}

export default SeeAlsoAdder
