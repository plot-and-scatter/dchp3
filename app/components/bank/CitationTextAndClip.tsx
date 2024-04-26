import { useState } from "react"
import LabelledField from "./LabelledField"
import TextArea from "./TextArea"
import Input from "./Input"
import type { BankEditCitationFieldsProps } from "./BankEditCitationFields"

export default function CitationTextAndClip({
  citation,
  citationFields,
}: BankEditCitationFieldsProps) {
  const [clipStart, setClipStart] = useState(citation?.clip_start || 0)
  const [clipEnd, setClipEnd] = useState(citation?.clip_end || 0)
  const [citationText, setCitationText] = useState(citation?.text || "")

  return (
    <>
      <LabelledField
        label={`Citation`}
        field={
          <TextArea
            placeholder="use [...] to leave out text. Code for <u>text</u> underscore, <b>text</b> bold, and <i>text</i> italics"
            name="citation.text"
            defaultValue={citation?.text}
            rows={10}
            onChange={(e) => {
              const typedText = e.target.value
              if (clipStart === 0 || clipEnd === 0) {
                setClipEnd(typedText.length)
              }
              if (clipStart > typedText.length) {
                setClipStart(typedText.length)
              }
              if (clipEnd > typedText.length) {
                setClipEnd(typedText.length)
              }
              setCitationText(e.target.value)
            }}
          />
        }
      />
      <LabelledField
        label={`Clip Indices`}
        field={
          <div className="flex items-center gap-x-4">
            <div>Start:</div>
            <Input
              name="citation.clip_start"
              type="number"
              value={clipStart}
              onChange={(e) => {
                const startNumber = parseInt(e.target.value)
                // if (startNumber > clipEnd) {
                //   setClipEnd(startNumber)
                // }
                setClipStart(startNumber)
              }}
              min={0}
              max={citationText.length}
            />
            {/* <input type="hidden" name="citation.clip_start" value={clipStart} /> */}
            <div>End:</div>
            <Input
              name="citation.clip_end"
              type="number"
              value={clipEnd}
              onChange={(e) => {
                const endNumber = parseInt(e.target.value)
                // if (endNumber < clipStart) {
                //   setClipStart(endNumber)
                // }
                setClipEnd(endNumber)
              }}
              min={clipStart}
              max={citationText.length}
            />
            {/* <input type="hidden" name="citation.clip_end" value={clipEnd} /> */}
          </div>
        }
      />
      <LabelledField
        label={`Clipped Text`}
        field={
          // TODO: Put this elsewhere. We are using the <code> tag because
          // the smartquotes feature does not apply to it.
          <>
            <Input
              name={`citation.clipped_text`}
              hidden
              value={citationText.substring(clipStart, clipEnd)}
              readOnly
            />
            <code style={{ fontFamily: "Charter, Georgia, serif" }}>
              {citationText.substring(0, clipStart)}
              <span className="bg-primary-light">
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
