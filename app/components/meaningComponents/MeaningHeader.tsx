import SanitizedTextSpan from "../SanitizedTextSpan"

interface MeaningHeaderProps {
  number: string | null
  dagger: boolean
  partOfSpeech: string
  usageNote: string
}

const MeaningHeader = ({
  number,
  dagger,
  partOfSpeech,
  usageNote,
}: MeaningHeaderProps) => {
  return (
    <>
      {((number && number !== "0") || dagger || partOfSpeech || usageNote) && (
        <div className="mb-2 bg-slate-100 p-2 leading-none shadow-sm shadow-slate-300 md:p-4 md:px-6">
          {number && number !== "0" && (
            <span className="mr-1 font-bold md:text-xl">{number}</span>
          )}
          {dagger && <span className="mr-1 align-super">&dagger;</span>}
          {partOfSpeech && (
            <span className="text-sm italic md:text-lg">
              <SanitizedTextSpan text={partOfSpeech} />
            </span>
          )}
          {usageNote && (
            <span className="text-sm italic  md:text-lg">
              {" "}
              &mdash; <SanitizedTextSpan text={usageNote} />
            </span>
          )}
        </div>
      )}
    </>
  )
}

export default MeaningHeader
