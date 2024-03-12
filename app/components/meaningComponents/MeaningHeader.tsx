import SanitizedTextSpan from "../EntryEditor/SanitizedTextSpan"

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
    <>
      {((number && number !== "0") || dagger || partOfSpeech || usage) && (
        <div className="mb-2 bg-gray-100 p-2 leading-none shadow-sm shadow-gray-300 md:p-4 md:px-6">
          {number && number !== "0" && (
            <span className="mr-1 font-bold md:text-xl">{number}</span>
          )}
          {dagger && <span className="mr-1 align-super">&dagger;</span>}
          {partOfSpeech && (
            <span className="text-sm italic md:text-lg">
              <SanitizedTextSpan text={partOfSpeech} />
            </span>
          )}
          {usage && (
            <span className="text-sm italic  md:text-lg">
              {" "}
              &mdash; <SanitizedTextSpan text={usage} />
            </span>
          )}
        </div>
      )}
    </>
  )
}

export default MeaningHeader
