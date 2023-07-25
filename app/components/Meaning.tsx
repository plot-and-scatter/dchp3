import React, { useState } from "react"
import type { LoadedDataType } from "~/routes/entries/$headword"
import Definition from "./Definition"
import HandNoteBlock from "~/components/HandNoteBlock"
import SanitizedTextSpan from "~/components/SanitizedTextSpan"
import Canadianism from "./Canadianism"
import Citations from "./Citations"
import SeeAlso from "~/components/SeeAlso"

export type MeaningType = LoadedDataType["meanings"][0]

interface MeaningProps {
  meaning: MeaningType
}

const Meaning = ({ meaning }: MeaningProps): JSX.Element => {
  const {
    order: number,
    partofspeech: partOfSpeech,
    usage: usageNote,
    dagger,
  } = meaning

  const [editable, setEditable] = useState("false")
  const changeEditable = (val: string) => {
    const nextVal = val === "true" ? "false" : "true"
    setEditable(nextVal)
  }

  return (
    <div
      className="-mx-3 my-3 border-l-8 border-slate-200 md:my-8 md:text-lg"
      id={`meaning-${meaning.id}`}
    >
      <div className="h-10 bg-slate-200">
        <label className="mx-5">
          Editable
          <input
            name="editable"
            value={editable}
            onChange={(e) => {
              changeEditable(e.target.value)
            }}
            className="mx-5 border bg-slate-100"
            type="checkbox"
          />
        </label>
        <p>{editable}</p>
      </div>
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
      <div className="flex flex-col gap-2 p-2 md:p-4 md:px-6">
        <Definition meaning={meaning} />
        <Canadianism meaning={meaning} />
        <SeeAlso seeAlso={meaning.seeAlso} />
        {meaning.usageNotes.length > 0 &&
          meaning.usageNotes.map((usageNote) => (
            <HandNoteBlock key={`usage-note-${usageNote.id}`}>
              <SanitizedTextSpan text={usageNote.text} />
            </HandNoteBlock>
          ))}
        <Citations meaning={meaning} />
      </div>
    </div>
  )
}

export default Meaning
