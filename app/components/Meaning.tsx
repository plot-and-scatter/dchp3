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
import MeaningHeaderForm from "./meaningComponents/MeaningHeaderForm"
import { editablePopoverInputTypes } from "./editing/EditablePopoverInput"
import EditingPopover from "./editing/EditingPopover"
import { attributeEnum } from "./editing/attributeEnum"
import { useParams } from "@remix-run/react"

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

  const [editable, setEditable] = useState(false)

  const params = useParams()
  const headword = params.headword

  return (
    <>
      <div
        className="-mx-3 my-3 border-l-8 border-slate-200 md:my-8 md:text-lg"
        id={`meaning-${meaning.id}`}
      >
        <DisplayEditorToggle editable={editable} setEditable={setEditable} />
        <MeaningHeaderForm
          shouldDisplay={editable}
          meaning={meaning}
          number={number}
          dagger={dagger}
          partOfSpeech={partOfSpeech}
          usageNote={usageNote}
        />
        <MeaningHeader
          number={number}
          dagger={dagger}
          partOfSpeech={partOfSpeech}
          usageNote={usageNote}
        />
        <div className="flex flex-col gap-2 p-2 md:p-4 md:px-6">
          <div className="flex flex-row">
            <Definition meaning={meaning} />
            <EditingPopover
              currentValue={meaning.definition}
              attributeType={attributeEnum.DEFINITION}
              attributeID={meaning.id}
              type={editablePopoverInputTypes.TEXTAREA}
            />
          </div>
          <Canadianism meaning={meaning} />
          <EditingPopover
            headword={headword ?? ""}
            currentValue={meaning.canadianism_type_comment ?? ""}
            type={editablePopoverInputTypes.TEXTAREA}
            attributeType={attributeEnum.CANADIANISM}
            attributeID={meaning.id}
            icon="edit"
          />
          <div className="flex flex-row">
            <SeeAlso seeAlso={meaning.seeAlso} />
            <EditingPopover
              headword={headword ?? ""}
              type={editablePopoverInputTypes.SEE_ALSO}
              attributeType={attributeEnum.SEE_ALSO}
              attributeID={meaning.id}
              icon="add"
            />
          </div>
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
