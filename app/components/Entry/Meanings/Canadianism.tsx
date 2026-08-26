import { Fragment } from "react"
import SanitizedTextSpan from "~/components/Entry/Common/SanitizedTextSpan"
import type { MeaningType } from "./Meaning"

interface CanadianismProps {
  meaning: MeaningType
}

const Canadianism = ({ meaning }: CanadianismProps): JSX.Element => {
  return (
    <Fragment>
      {(meaning.canadianism_type || meaning.canadianism_type_comment) && (
        <div className="mb-4 border border-gray-300 bg-gray-100 p-4 shadow-sm">
          {/* See the file `additional.css` for <br/> styling. */}
          <div className="CanadianismTypeComment">
            {meaning.canadianism_type && (
              <Fragment>
                <em className="font-medium">
                  Type: <SanitizedTextSpan text={meaning.canadianism_type} />{" "}
                </em>
                &mdash;{" "}
              </Fragment>
            )}
            <SanitizedTextSpan
              toDoubleBreaks
              text={meaning.canadianism_type_comment}
            />
          </div>
        </div>
      )}
    </Fragment>
  )
}

export default Canadianism
