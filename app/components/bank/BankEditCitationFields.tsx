import { Fragment } from "react"
import { BankLegacyTypeEnum, BankPosEnum } from "~/models/bank.types"
import { enumToOptions } from "~/utils/inputUtils"
import Input from "./Input"
import Select from "./Select"
import TextArea from "./TextArea"
import CitationTextAndClip from "./CitationTextAndClip"
import LabelledField from "./LabelledField"
import type { EditCitationIdLoaderData } from "~/routes/bank/edit/$citationId"
import RadioOrCheckbox from "./RadioOrCheckbox"

export type BankEditCitationFieldsProps = {
  citation?: EditCitationIdLoaderData["citation"]
  //conformFields?: Fieldset<z.infer<typeof BankCreateFormDataSchema>>
  citationFields?: any
}

export default function BankEditCitationFields({
  citationFields,
  citation,
}: BankEditCitationFieldsProps) {
  return (
    <Fragment>
      {citation?.id && <LabelledField label={`ID`} field={citation.id} />}
      <LabelledField
        label={`Headword`}
        field={
          <Input
            conformField={citationFields?.headword}
            name="citation.headword"
            defaultValue={citation?.headword?.headword}
            placeholder="e.g. Canuck"
          />
        }
      />
      <LabelledField
        label={`Short Meaning`}
        field={
          <TextArea
            conformField={citationFields?.short_meaning}
            name="citation.short_meaning"
            defaultValue={citation?.short_meaning}
            placeholder="e.g. Native of Canada"
          />
        }
      />
      <LabelledField
        label={`Spelling Variant`}
        field={
          <Input
            name="citation.spelling_variant"
            defaultValue={citation?.spelling_variant}
            placeholder="e.g. Kanuck (as it appears in citation)"
          />
        }
      />
      <LabelledField
        label={`POS`}
        field={
          <Select
            name={`citation.part_of_speech`}
            defaultValue={citation?.part_of_speech ?? undefined}
            options={enumToOptions(BankPosEnum)}
          />
        }
      />
      <CitationTextAndClip
        citation={citation}
        citationFields={citationFields}
      />
      {citation && (
        <Fragment>
          <LabelledField
            label={`Time Added`}
            field={
              <Fragment>
                {/* Single fetch hands these to the browser as real Dates.
                    The classic compiler's JSON serialization stringified them
                    on the way, and rendering a Date directly throws
                    "Objects are not valid as a React child". toISOString
                    reproduces exactly what was shown before. */}
                {citation.created?.toISOString()} by {citation.creator?.email}
              </Fragment>
            }
          />
          <LabelledField
            label={`Last Modified`}
            field={<Fragment>{citation.last_modified?.toISOString()}</Fragment>}
          />
        </Fragment>
      )}
      <LabelledField
        label={`Memo`}
        field={
          <TextArea
            rows={3}
            name={`citation.memo`}
            defaultValue={citation?.memo}
            placeholder="information that pertains to this particular citation but cannot be entered elsewhere, e.g. meaning_short is ambiguous, even with more context than shown here"
          />
        }
      />
      <LabelledField
        label={`Data Type`}
        field={
          <Select
            name={`citation.legacy_id`}
            defaultValue={citation?.legacy_id || BankLegacyTypeEnum["DCHP-3"]}
            options={enumToOptions(BankLegacyTypeEnum)}
          />
        }
      />
      <LabelledField
        label={`Incomplete?`}
        field={
          <RadioOrCheckbox
            type="radio"
            className={`flex gap-x-4`}
            optionSetClassName={`flex gap-x-2`}
            name={`citation.is_incomplete`}
            options={[
              { label: `Yes`, value: `true` },
              { label: `No`, value: `false` },
            ]}
            defaultValue={
              citation ? (citation.is_incomplete ? "true" : "false") : "false"
            }
          />
        }
      />
    </Fragment>
  )
}
