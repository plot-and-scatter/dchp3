import { Popover } from "@headlessui/react"
import type { CitationType } from "../Citation"
import BibliographyItem from "./BibliographyItem"

import { usePopper } from "react-popper"
import { useState } from "react"
import { Link } from "./LinksAndButtons/Link"

interface BibliographyPopoverProps {
  citation: CitationType
}

const BibliographyPopover = ({ citation }: BibliographyPopoverProps) => {
  let [referenceElement, setReferenceElement] = useState<HTMLElement | null>()
  let [popperElement, setPopperElement] = useState<HTMLElement | null>()
  let { styles, attributes } = usePopper(referenceElement, popperElement)

  if (!citation) return <></>

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
          <dl>
            <BibliographyItem label="Author" value={citation["author"]} />
            <BibliographyItem label="Editor" value={citation["editor"]} />
            <BibliographyItem
              label="Short Title"
              value={citation["short_title"]}
            />
            <BibliographyItem label="Title" value={citation["title"]} />
            <BibliographyItem label="Page" value={citation["page"]} />
            <BibliographyItem
              label="Periodical Date"
              value={citation["perio_date"]}
            />
            <BibliographyItem label="Vol. Iss." value={citation["vol_iss"]} />
            <BibliographyItem label="Publisher" value={citation["publisher"]} />
            <BibliographyItem
              label="Year Published"
              value={citation["yearpub"]}
            />
            <BibliographyItem
              label="URL"
              value={
                <Link to={citation["url"] || ""} target="_new">
                  {citation.url}
                </Link>
              }
            />
            <BibliographyItem label="Uttered" value={citation["uttered"]} />
            <BibliographyItem label="Place" value={citation["place"]} />
            <BibliographyItem label="Media" value={citation["media"]} />
            <BibliographyItem label="Broadcast" value={citation["broadcast"]} />
            <BibliographyItem label="Evidence" value={citation["evidence"]} />
          </dl>
        </div>
      </Popover.Panel>
    </Popover>
  )
}

export default BibliographyPopover
