import { enumToSelectOptions } from "~/utils/inputUtils"
import { BankLegacyTypeEnum, BankPosEnum } from "~/models/bank.types"
import BankInput from "./BankInput"
import BankRadio from "./BankRadio"
import BankSelect from "./BankSelect"
import BankTextArea from "./BankTextArea"
import LabelledField from "./LabelledField"
import CitationTextAndClip from "./CitationTextAndClip"
import type { EditCitationProps } from "./EditCitationProps"

export default function BankEditCitationFields(props: EditCitationProps) {
  const { citation } = props

  return (
    <>
      <LabelledField label={`ID`} field={citation.id} />
      <LabelledField
        label={`Headword`}
        field={
          <BankInput
            name="citation.headword"
            defaultValue={citation.headword}
          />
        }
      />
      <LabelledField
        label={`Short Meaning`}
        field={
          <BankTextArea
            name="citation.short_meaning"
            defaultValue={citation.short_meaning}
          />
        }
      />
      <LabelledField
        label={`Spelling Variant`}
        field={
          <BankInput
            name="citation.spelling_variant"
            defaultValue={citation.spelling_variant}
          />
        }
      />
      <LabelledField
        label={`POS`}
        field={
          <BankSelect
            name={`citation.part_of_speech`}
            defaultValue={citation.part_of_speech}
            options={enumToSelectOptions(BankPosEnum)}
          />
        }
      />
      <CitationTextAndClip {...props} />
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
        field={
          <BankTextArea name={`citation.memo`} defaultValue={citation.memo} />
        }
      />
      <LabelledField
        label={`Data Type`}
        field={
          <BankSelect
            name={`citation.legacy_id`}
            defaultValue={citation.legacy_id}
            options={enumToSelectOptions(BankLegacyTypeEnum)}
          />
        }
      />
      <LabelledField
        label={`Incomplete?`}
        field={
          <BankRadio
            className={`flex gap-x-4`}
            optionSetClassName={`flex gap-x-2`}
            name={`citation.is_incomplete`}
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
