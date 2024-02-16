import React from "react"
import SanitizedTextSpan from "~/components/SanitizedTextSpan"
import BibliographyPopover from "./elements/BibliographyPopover"
import type { MeaningType } from "./Meaning"
import { Link } from "./elements/LinksAndButtons/Link"

export type CitationType = MeaningType["citations"][0]["citation"]

interface CitationProps {
  citation: CitationType
}

const Citation = ({ citation }: CitationProps): JSX.Element => {
  if (!citation) return <></>
  return (
    <div>
      <span className="mr-2 font-bold leading-tight text-gray-500">
        {citation.yearcomp || citation.yearpub}
      </span>
      <div className="inline">
        <SanitizedTextSpan text={citation.citation} />
      </div>
      <div className="inline text-sm ">
        {citation.url && (
          <Link
            appearance="primary"
            className="ml-2 cursor-pointer"
            to={citation.url}
            target="_new"
          >
            <i className="fa-regular fa-photo-film"></i>
          </Link>
        )}
        <BibliographyPopover citation={citation} />
      </div>
    </div>
  )
}

export default Citation
