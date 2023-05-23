import React from "react"
import DictionaryVersion from "./DictionaryVersion"
import HandNoteBlock from "./HandNoteBlock"

interface HeadwordProps {
  alternatives?: string
  etymology?: string
  generalLabels?: string
  handNote?: string
  isLegacy: boolean
  isNonCanadian?: boolean
  word: string
}

const Headword = ({
  alternatives,
  etymology,
  generalLabels,
  handNote,
  isLegacy,
  isNonCanadian,
  word,
}: HeadwordProps): JSX.Element => {
  return (
    <div className="flex flex-col gap-2 leading-tight md:gap-4" id="headword">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl leading-tight md:text-5xl">{word}</h1>
        <DictionaryVersion isLegacy={isLegacy} />
      </div>
      {alternatives && (
        <h2 className="leading-tight text-slate-700 md:text-xl">
          <span className="text-slate-500">Spelling variants:</span>{" "}
          <span className="italic">{alternatives}</span>
        </h2>
      )}
      <p>
        {etymology && <span className="mr-1">{etymology}</span>}
        {generalLabels && <span className="mr-1 italic">{generalLabels}</span>}
      </p>
      {handNote && (
        <HandNoteBlock className="text-xs text-slate-500 md:text-lg">
          {handNote}
        </HandNoteBlock>
      )}
      {isNonCanadian && (
        <div className="border border-red-300 bg-red-200 p-3 font-bold">
          Non-Canadianism
        </div>
      )}
    </div>
  )
}

export default Headword
