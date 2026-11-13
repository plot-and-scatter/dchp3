import { Fragment } from "react"
import SanitizedTextSpan from "../Common/SanitizedTextSpan"

interface MeaningHeaderProps {
  number: string | null
  dagger: boolean
  partOfSpeech: string
  usage: string
}

const MeaningHeader = ({
  number,
  dagger,
  partOfSpeech,
  usage,
}: MeaningHeaderProps) => {
  return (
    <Fragment>
      {((number && number !== "0") || dagger || partOfSpeech || usage) && (
        <div className="mb-2 flex flex-wrap items-baseline gap-x-2 bg-gray-100 p-2 leading-none shadow-sm shadow-gray-300 md:p-4 md:px-6">
          {number && number !== "0" && (
            <span className="font-bold md:text-xl">{number}</span>
          )}
          {/* Small caps at the part-of-speech size, so the label's capitals
              match the x-height of the italic text beside it. */}
          {dagger && (
            <span className="text-sm font-semibold tracking-wide text-gray-600 [font-variant-caps:small-caps] md:text-lg">
              Non-Cdn.
            </span>
          )}
          {partOfSpeech && (
            <span className="text-sm italic md:text-lg">
              <SanitizedTextSpan text={partOfSpeech} />
            </span>
          )}
          {usage && (
            <span className="text-sm italic md:text-lg">
              &mdash; <SanitizedTextSpan text={usage} />
            </span>
          )}
        </div>
      )}
    </Fragment>
  )
}

export default MeaningHeader
