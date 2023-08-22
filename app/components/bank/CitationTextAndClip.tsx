import { useState } from "react"
import type { EditCitationProps } from "./EditCitationProps"
import LabelledField from "./LabelledField"
import BankTextArea from "./BankTextArea"
import BankNumericInput from "./BankNumericInput"
import BankInput from "./BankInput"

export default function CitationTextAndClip({ citation }: EditCitationProps) {
  const [clipStart, setClipStart] = useState(citation?.clip_start || 0)
  const [clipEnd, setClipEnd] = useState(citation?.clip_end || 0)
  const [citationText, setCitationText] = useState(citation?.text || "")

  return (
    <>
      <LabelledField
        label={`Citation`}
        field={
          <BankTextArea
            name="citation.text"
            defaultValue={citation?.text}
            rows={10}
            onChange={(e) => {
              setCitationText(e.target.value)
              if (clipStart === 0 || clipEnd === 0) {
                setClipEnd(e.target.value.length)
              }
            }}
          />
        }
      />
      <LabelledField
        label={`Clip Indices`}
        field={
          <div className="flex items-center gap-x-4">
            <div>Start:</div>
            <BankNumericInput
              name="citation.clip_start"
              defaultValue={clipStart}
              onChange={(e) => {
                setClipStart(parseInt(e.target.value))
                if (parseInt(e.target.value) > clipEnd) {
                  setClipEnd(parseInt(e.target.value))
                }
              }}
              min={0}
              max={citationText.length}
            />
            <div>End:</div>
            <BankNumericInput
              name="citation.clip_end"
              defaultValue={clipEnd}
              onChange={(e) => setClipEnd(parseInt(e.target.value))}
              min={clipStart}
              max={citationText.length}
            />
          </div>
        }
      />
      <LabelledField
        label={`Clipped Text`}
        field={
          // TODO: Put this elsewhere. We are using the <code> tag because
          // the smartquotes feature does not apply to it.
          <>
            <BankInput
              name={`citation.clipped_text`}
              hidden
              value={citationText.substring(clipStart, clipEnd)}
            />
            <code style={{ fontFamily: "Charter, Georgia, serif" }}>
              {citationText.substring(0, clipStart)}
              <span className="bg-red-300">
                {citationText.substring(clipStart, clipEnd)}
              </span>
              {citationText.substring(clipEnd)}
            </code>
          </>
        }
      />
    </>
  )
}