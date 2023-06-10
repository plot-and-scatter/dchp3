import React, { useCallback } from "react"
import DictionaryVersion from "./DictionaryVersion"
import HandNoteBlock from "./HandNoteBlock"
import SanitizedTextSpan from "./SanitizedTextSpan"
import { useNavigate, useParams } from "@remix-run/react"

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
  const params = useParams()
  const navigate = useNavigate()

  const navigateToEditEntry = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      navigate(`/entries/${params.headword}/edit`)
      return false
    },
    [navigate, params.headword]
  )

  // TODO: Check authentication
  const authenticated = true
  const hidden = authenticated ? "" : "hidden"

  return (
    <div className="flex flex-col gap-2 leading-tight md:gap-4" id="headword">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl leading-tight md:text-5xl">{word}</h1>
        <div className="flex justify-center">
          <form onSubmit={navigateToEditEntry}>
            <button
              className={`mr-2 ml-8 bg-slate-500 p-1 text-white hover:bg-slate-400 ${hidden}`}
              type="submit"
            >
              Edit
            </button>
          </form>
          <DictionaryVersion isLegacy={isLegacy} />
        </div>
      </div>
      {alternatives && (
        <h2 className="leading-tight text-slate-700 md:text-xl">
          <span className="text-slate-500">Spelling variants:</span>{" "}
          <span className="italic">
            <SanitizedTextSpan text={alternatives} />
          </span>
        </h2>
      )}
      <p>
        {etymology && (
          <span className="mr-1">
            <SanitizedTextSpan text={etymology} />
          </span>
        )}
        {generalLabels && (
          <span className="mr-1 italic">
            <SanitizedTextSpan text={generalLabels} />
          </span>
        )}
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
