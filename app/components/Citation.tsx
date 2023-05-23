import React from "react"
import SanitizedTextSpan from "~/components/SanitizedTextSpan"
import BibliographyPopover from "./elements/BibliographyPopover"
import type { MeaningType } from "./Meaning"

export type CitationType = MeaningType["citations"][0]["citation"]

interface CitationProps {
  citation: CitationType
}

const Citation = ({ citation }: CitationProps): JSX.Element => {
  if (!citation) return <></>
  return (
    <div>
      <span className="mr-2 font-bold leading-tight text-slate-500">
        {citation.yearcomp || citation.yearpub}
      </span>
      <div className="inline">
        <SanitizedTextSpan text={citation.citation} />
      </div>
      <div className="inline text-sm ">
        {citation.url && (
          <a
            className="ml-2 cursor-pointer text-red-400 hover:text-red-600"
            href={citation.url}
            target="_new"
          >
            <i className="fa-regular fa-photo-film"></i>
          </a>
        )}
        <BibliographyPopover citation={citation} />
      </div>
    </div>
  )
}

export default Citation
