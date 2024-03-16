import { BankSourceTypeEnum } from "~/models/bank.types"
import Input from "../Input"
import LabelledField from "../LabelledField"
import type { BankEditCitationFieldsProps } from "../BankEditCitationFields"

export default function SpokenLanguagePanel(
  props: BankEditCitationFieldsProps
) {
  const citation = props.citation
  const source = citation?.source

  const showField = source?.type_id === BankSourceTypeEnum["Spoken Language"]

  return (
    <>
      <LabelledField
        label={`Year Heard`}
        field={
          <Input
            name={`source.year_published`}
            showField={showField}
            defaultValue={source?.year_published}
            placeholder="e.g. 2007"
          />
        }
      />
      <LabelledField
        label={`Year Recorded`}
        field={
          <Input
            name={`source.year_composed`}
            showField={showField}
            defaultValue={source?.year_composed}
            placeholder="if recorded, e.g. 1981"
          />
        }
      />
      <LabelledField
        label={`Uttered By:`}
        field={
          <Input
            name={`author`}
            showField={showField}
            defaultValue={source?.author?.name}
            placeholder="e.g. Johnston, John L."
          />
        }
      />
      <LabelledField
        label={`Media Name:`}
        field={
          <Input
            name={`source.utterance_media`}
            showField={showField}
            defaultValue={source?.utterance_media}
            placeholder="e.g. CBC Radio One"
          />
        }
      />
      <LabelledField
        label={`Broadcast Name:`}
        field={
          <Input
            name={`source.utterance_broadcast`}
            showField={showField}
            defaultValue={source?.utterance_broadcast}
            placeholder="e.g. Quirks and Quarks"
          />
        }
      />
      <LabelledField
        label={`Date of Utterance:`}
        field={
          <Input
            name={`source.periodical_date`}
            showField={showField}
            defaultValue={source?.periodical_date}
            placeholder="if available, e.g. 17 May 1981"
          />
        }
      />
      <LabelledField
        label={`Time Apx.:`}
        field={
          <Input
            name={`source.utterance_time`}
            showField={showField}
            defaultValue={source?.utterance_time}
            placeholder="e.g. 1:15 PM"
          />
        }
      />
      <LabelledField
        label={`Place:`}
        field={
          <Input
            name={`place`}
            showField={showField}
            defaultValue={source?.place?.name}
            placeholder="e.g. Toronto, ON; London, UK; New York, USA"
          />
        }
      />
      <LabelledField
        label={`Witnessed by:`}
        field={
          <Input
            name={`source.utterance_witness`}
            showField={showField}
            defaultValue={source?.utterance_witness}
            placeholder="e.g. Fee, Margery"
          />
        }
      />
      <LabelledField
        label={`URL`}
        field={
          <Input
            name={`source.url`}
            showField={showField}
            defaultValue={source?.url}
            placeholder="enter URL if electronic resource"
          />
        }
      />
      <LabelledField
        label={`URL Acc. Date`}
        field={
          <Input
            name={`source.url_access_date`}
            showField={showField}
            defaultValue={source?.url_access_date}
            placeholder="e.g. 1 Jul. 2007"
          />
        }
      />
    </>
  )
}
