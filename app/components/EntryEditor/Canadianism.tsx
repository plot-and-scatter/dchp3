import React from "react"
import SanitizedTextSpan from "~/components/Entry/Common/SanitizedTextSpan"
import type { MeaningType } from "../Entry/Meanings/Meaning"

interface CanadianismProps {
  meaning: MeaningType
}

const Canadianism = ({ meaning }: CanadianismProps): JSX.Element => {
  return (
    <>
      {(meaning.canadianism_type || meaning.canadianism_type_comment) && (
        <div className="-m-2 mb-2 border border-gray-300 bg-gray-100 px-4 py-2 pb-0 shadow-sm">
          {meaning.canadianism_type && (
            <em>
              Type: <SanitizedTextSpan text={meaning.canadianism_type} />{" "}
              &mdash;{" "}
            </em>
          )}
          <SanitizedTextSpan text={meaning.canadianism_type_comment} />
        </div>
      )}
    </>
  )
}

export default Canadianism
