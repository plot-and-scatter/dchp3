import React from "react"
import type { MeaningType } from "./Meaning"
import EditingPopover from "./editing/EditingPopover"
import { attributeEnum } from "./editing/attributeEnum"
import { editablePopoverInputTypes } from "./editing/EditablePopoverInput"
import SeeAlsoItem from "./SeeAlsoItem"

export type SeeAlsoList = MeaningType["seeAlso"]

interface SeeAlsoItemsProps {
  seeAlsoItems: SeeAlsoList
}

const SeeAlsoItems = ({ seeAlsoItems }: SeeAlsoItemsProps): JSX.Element => {
  if (!seeAlsoItems || seeAlsoItems.length === 0) {
    return <></>
  }

  return (
    <div>
      <em>See also:</em>{" "}
      {seeAlsoItems.map((seeAlso, index) => {
        return (
          <React.Fragment
            key={`see-also-${seeAlso.meaning_id}-${seeAlso.entry_id}`}
          >
            {index > 0 && <span className="mr-3">,</span>}
            <SeeAlsoItem seeAlso={seeAlso} />
            <EditingPopover
              currentValue={seeAlso.entry.headword}
              type={editablePopoverInputTypes.DELETE}
              attributeType={attributeEnum.DELETE_SEE_ALSO}
              attributeID={seeAlso.meaning_id}
              icon="delete"
            >
              <input type="hidden" name="entryId" value={seeAlso.entry_id} />
            </EditingPopover>
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default SeeAlsoItems
