import React from "react"
import SanitizedTextSpan from "../components/SanitizedTextSpan"

interface DefinitionProps {
  children: React.ReactNode
  number: string
  partOfSpeech: string
  usageNote?: string
  dagger?: boolean
}

const Definition = ({
  children,
  dagger,
  number,
  partOfSpeech,
  usageNote,
}: DefinitionProps): JSX.Element => {
  console.log({ number, dagger, partOfSpeech, usageNote })

  return (
    <div className="-mx-3 my-3 border-l-8 border-slate-200 md:my-8 md:text-lg">
      {((number && number !== "0") || dagger || partOfSpeech || usageNote) && (
        <div className="mb-2 bg-slate-100 p-2 leading-none shadow-sm shadow-slate-300 md:p-4 md:px-6">
          {number && number !== "0" && (
            <span className="mr-1 font-bold md:text-xl">{number}</span>
          )}
          {dagger && <span>&dagger;</span>}
          <span className="text-sm italic md:text-lg">
            <SanitizedTextSpan text={partOfSpeech} />
          </span>
          {usageNote && (
            <span className="text-sm italic  md:text-lg">
              {" "}
              &mdash; <SanitizedTextSpan text={usageNote} />
            </span>
          )}
        </div>
      )}
      <div className="flex flex-col gap-2 p-2 md:p-4 md:px-6">{children}</div>
    </div>
  )
}

export default Definition
