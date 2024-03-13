import React from "react"

import type { MeaningType } from "./Meaning"
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
      <em>See:</em>{" "}
      {seeAlsoItems.map((seeAlso, index) => {
        return (
          <React.Fragment
            key={`see-also-${seeAlso.meaning_id}-${seeAlso.entry_id}`}
          >
            {index > 0 && <span className="mr-3">,</span>}
            <SeeAlsoItem seeAlso={seeAlso} />
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default SeeAlsoItems
