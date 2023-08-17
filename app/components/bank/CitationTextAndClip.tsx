import { useState } from "react"
import type { EditCitationProps } from "./EditCitationProps"
import LabelledField from "./LabelledField"
import BankTextArea from "./BankTextArea"
import BankNumericInput from "./BankNumericInput"

export default function CitationTextAndClip({ citation }: EditCitationProps) {
  const [clipStart, setClipStart] = useState(citation.clip_start)
  const [clipEnd, setClipEnd] = useState(citation.clip_end)

  return (
    <>
      <LabelledField
        label={`Citation`}
        field={
          <BankTextArea
            name="citationText"
            defaultValue={citation.text}
            rows={10}
          />
        }
      />
      <LabelledField
        label={`Clip Indices`}
        field={
          <div className="flex items-center gap-x-4">
            <div>Start:</div>
            <BankNumericInput
              name="clipIndexStart"
              defaultValue={citation.clip_start}
              onChange={(e) => setClipStart(parseInt(e.target.value))}
            />
            <div>End:</div>
            <BankNumericInput
              name="clipIndexStart"
              defaultValue={citation.clip_end}
              onChange={(e) => setClipEnd(parseInt(e.target.value))}
            />
          </div>
        }
      />
      <LabelledField
        label={`Clipped Text`}
        field={
          // TODO: Put this elsewhere. We are using the <code> tag because
          // the smartquotes feature does not apply to it.
          <code style={{ fontFamily: "Charter, Georgia, serif" }}>
            {citation.text.substring(0, clipStart)}
            <span className="bg-red-300">
              {citation.text.substring(clipStart, clipEnd)}
            </span>
            {citation.text.substring(clipEnd)}
          </code>
        }
      />
    </>
  )
}
