import { enumToSelectOptions } from "~/utils/inputUtils"
import {
  LegacyTypeEnum,
  type GetCitationByIdType,
  POSEnum,
} from "~/models/bank.types"
import { useState } from "react"
import BankInput from "./BankInput"
import BankNumericInput from "./BankNumericInput"
import BankRadio from "./BankRadio"
import BankSelect from "./BankSelect"
import BankTextArea from "./BankTextArea"
import LabelledField from "./LabelledField"

interface BankEditCitationFieldsProps {
  citation: GetCitationByIdType
}

export default function BankEditCitationFields({
  citation,
}: BankEditCitationFieldsProps) {
  const [clipStart, setClipStart] = useState(citation.clip_start)
  const [clipEnd, setClipEnd] = useState(citation.clip_end)

  return (
    <>
      <LabelledField label={`ID`} field={citation.id} />
      <LabelledField
        label={`Headword`}
        field={<BankInput name="headword" defaultValue={citation.headword} />}
      />
      <LabelledField
        label={`Short Meaning`}
        field={
          <BankTextArea
            name="shortMeaning"
            defaultValue={citation.short_meaning}
          />
        }
      />
      <LabelledField
        label={`Spelling Variant`}
        field={
          <BankInput
            name="spellingVariant"
            defaultValue={citation.spelling_variant}
          />
        }
      />
      <LabelledField
        label={`POS`}
        field={
          <BankSelect
            name={`pos`}
            defaultValue={citation.part_of_speech}
            options={enumToSelectOptions(POSEnum)}
          />
        }
      />
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
      <LabelledField
        label={`Time Added`}
        field={
          <>
            {citation.created} by {citation.email}
          </>
        }
      />
      <LabelledField
        label={`Last Modified`}
        field={<>{citation.last_modified}</>}
      />
      <LabelledField
        label={`Memo`}
        field={<BankTextArea name={`memo`} defaultValue={citation.memo} />}
      />
      <LabelledField
        label={`Data Type`}
        field={
          <BankSelect
            name={`legacy_id`}
            defaultValue={citation.legacy_id}
            options={enumToSelectOptions(LegacyTypeEnum)}
          />
        }
      />
      <LabelledField
        label={`Incomplete?`}
        field={
          <BankRadio
            className={`flex gap-x-4`}
            optionSetClassName={`flex gap-x-2`}
            name={`incomplete`}
            options={[
              { name: `Yes`, value: `true` },
              { name: `No`, value: `false` },
            ]}
            defaultValue={citation.is_incomplete ? "true" : "false"}
          />
        }
      />
    </>
  )
}
