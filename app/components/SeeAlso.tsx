import { NavLink } from "@remix-run/react"
import React from "react"
import type { MeaningType } from "./Meaning"
import EditingPopover from "./editing/EditingPopover"
import { attributeEnum } from "./editing/attributeEnum"
import { editablePopoverInputTypes } from "./editing/EditablePopoverInput"

export type SeeAlsoType = MeaningType["seeAlso"]

interface SeeAlsoProps {
  seeAlso: SeeAlsoType
}

const SeeAlso = ({ seeAlso }: SeeAlsoProps): JSX.Element => {
  if (!seeAlso || seeAlso.length === 0) {
    return <></>
  }

  console.log("seeAlso", seeAlso)

  return (
    <div>
      <em>See also:</em>{" "}
      {seeAlso.map((seeAlsoItem, index) => {
        return (
          <React.Fragment
            key={`see-also-${seeAlsoItem.meaning_id}-${seeAlsoItem.entry_id}`}
          >
            {index > 0 && <span className="mr-3">,</span>}
            <span>
              <NavLink
                className={`text-sm font-bold uppercase tracking-widest text-red-500 underline hover:text-red-700 md:text-base md:tracking-wider`}
                to={`/entries/${seeAlsoItem.entry.headword}`}
              >
                {seeAlsoItem.entry.headword}
              </NavLink>
              {seeAlsoItem.linknote && (
                <span className="ml-1">{seeAlsoItem.linknote}</span>
              )}
            </span>
            <EditingPopover
              currentValue={seeAlsoItem.entry.headword}
              type={editablePopoverInputTypes.DELETE}
              attributeType={attributeEnum.DELETE_SEE_ALSO}
              attributeID={seeAlsoItem.meaning_id}
              icon="delete"
            >
              <input
                type="hidden"
                name="entryId"
                value={seeAlsoItem.entry_id}
              />
            </EditingPopover>
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default SeeAlso
