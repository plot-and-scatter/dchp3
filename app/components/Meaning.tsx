import React, { useState } from "react"
import type { LoadedDataType } from "~/routes/entries/$headword"
import Definition from "./Definition"
import HandNoteBlock from "~/components/HandNoteBlock"
import SanitizedTextSpan from "~/components/SanitizedTextSpan"
import Canadianism from "./Canadianism"
import Citations from "./Citations"
import SeeAlso from "~/components/SeeAlso"
import DisplayEditorToggle from "./meaningComponents/DisplayEditorToggle"
import MeaningHeader from "./meaningComponents/MeaningHeader"
import { Form } from "@remix-run/react"
import { parseBooleanOrError } from "~/utils/generalUtils"
import { attributeEnum } from "./editing/attributeEnum"

export type MeaningType = LoadedDataType["meanings"][0]

interface MeaningProps {
  word: string
  meaning: MeaningType
}

const Meaning = ({ word, meaning }: MeaningProps): JSX.Element => {
  const {
    order: number,
    partofspeech: partOfSpeech,
    usage: usageNote,
    dagger: daggerValue,
  } = meaning

  const [editable, setEditable] = useState(false)
  const [dagger, setDagger] = useState(daggerValue)

  return (
    <>
      <DisplayEditorToggle editable={editable} setEditable={setEditable} />
      <div
        className="-mx-3 my-3 border-l-8 border-slate-200 md:my-8 md:text-lg"
        id={`meaning-${meaning.id}`}
      >
        <Form
          action={`/entries/${word}`}
          method="post"
          className="bg-slate-200 py-5"
        >
          <label>
            Dagger:
            <input
              checked={dagger}
              name="dagger"
              onChange={(e) => setDagger(e.target.checked)}
              type="checkbox"
            />
          </label>
          <input type="hidden" name="newValue" value="hi" />
          <input type="hidden" name="attributeID" value={meaning.id} />
          <input
            type="hidden"
            name="attributeType"
            value={attributeEnum.MEANING_HEADER}
          />
          <button type="submit">submit</button>
        </Form>
        <MeaningHeader
          number={number}
          dagger={daggerValue}
          partOfSpeech={partOfSpeech}
          usageNote={usageNote}
        />
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
    </>
  )
}

export default Meaning
