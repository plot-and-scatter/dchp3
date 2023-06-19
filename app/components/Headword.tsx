import React, { useState } from "react"
import DictionaryVersion from "./DictionaryVersion"
import HandNoteBlock from "./HandNoteBlock"
import SanitizedTextSpan from "./SanitizedTextSpan"
import { updateEntryHeadword } from "~/utils/APIUtils"
import EditingPopover from "./editing/editingPopover"

interface HeadwordProps {
  alternatives?: string
  etymology?: string
  generalLabels?: string
  handNote?: string
  isLegacy: boolean
  isNonCanadian?: boolean
  word: string
}

async function handleSubmit(
  event: any,
  id: number,
  field: string,
  newValue: string
) {
  if (event.key === "Enter") {
    // alert("ENTER was pressed with: " + newValue)
    updateEntryHeadword(id, newValue)
  }
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
  const [text, setText] = useState(word)

  return (
    <div className="flex flex-col gap-2 leading-tight md:gap-4" id="headword">
      <div className="flex items-center justify-between">
        <input
          contentEditable="true"
          value={text}
          className=" bg-inherit text-3xl leading-tight hover:bg-red-300 md:text-5xl"
        />
        <EditingPopover first="hi" />
        <DictionaryVersion isLegacy={isLegacy} />
      </div>
      {alternatives && (
        <h2 className="leading-tight text-slate-700 md:text-xl">
          <span className="text-slate-500">Spelling variants:</span>{" "}
          <input>
            <span className="italic">
              <SanitizedTextSpan text={alternatives} />
            </span>
          </input>
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
