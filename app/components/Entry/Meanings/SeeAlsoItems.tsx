import React from "react"

import type { MeaningType } from "./Meaning"
import SeeAlsoItem from "./SeeAlsoItem"

export type SeeAlsoList = MeaningType["seeAlso"]

interface SeeAlsoItemsProps {
  seeAlsoItems: SeeAlsoList
  canUserViewDraftEntry: boolean
}

const SeeAlsoItems = ({
  seeAlsoItems,
  canUserViewDraftEntry,
}: SeeAlsoItemsProps): JSX.Element => {
  const visibleSeeAlsoItems = seeAlsoItems.filter(
    (seeAlso) => seeAlso.entry.is_public || canUserViewDraftEntry
  )

  if (
    !seeAlsoItems ||
    seeAlsoItems.length === 0 ||
    visibleSeeAlsoItems.length === 0
  ) {
    return <></>
  }

  return (
    <div>
      <em>See:</em>{" "}
      {visibleSeeAlsoItems.map((seeAlso, index) => {
        return (
          <React.Fragment
            key={`see-also-${seeAlso.meaning_id}-${seeAlso.entry_id}`}
          >
            {index > 0 && <span className="mr-1">,</span>}
            <SeeAlsoItem seeAlso={seeAlso} />
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default SeeAlsoItems
