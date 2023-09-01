import { BankSourceTypeEnum } from "~/models/bank.types"
import BankInput from "../BankInput"
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
          <BankInput
            name={`source.year_published`}
            showField={showField}
            defaultValue={source?.year_published}
          />
        }
      />
      <LabelledField
        label={`Year Recorded`}
        field={
          <BankInput
            name={`source.year_composed`}
            showField={showField}
            defaultValue={source?.year_composed}
          />
        }
      />
      <LabelledField
        label={`Uttered By:`}
        field={
          <BankInput
            name={`author`}
            showField={showField}
            defaultValue={source?.author?.name}
          />
        }
      />
      <LabelledField
        label={`Media Name:`}
        field={
          <BankInput
            name={`source.utterance_media`}
            showField={showField}
            defaultValue={source?.utterance_media}
          />
        }
      />
      <LabelledField
        label={`Broadcast Name:`}
        field={
          <BankInput
            name={`source.utterance_broadcast`}
            showField={showField}
            defaultValue={source?.utterance_broadcast}
          />
        }
      />
      <LabelledField
        label={`Date of Utterance:`}
        field={
          <BankInput
            name={`source.periodical_date`}
            showField={showField}
            defaultValue={source?.periodical_date}
          />
        }
      />
      <LabelledField
        label={`Time Apx.:`}
        field={
          <BankInput
            name={`source.utterance_time`}
            showField={showField}
            defaultValue={source?.utterance_time}
          />
        }
      />
      <LabelledField
        label={`Place:`}
        field={
          <BankInput
            name={`place`}
            showField={showField}
            defaultValue={source?.place?.name}
          />
        }
      />
      <LabelledField
        label={`Witnessed by:`}
        field={
          <BankInput
            name={`source.utterance_witness`}
            showField={showField}
            defaultValue={source?.utterance_witness}
          />
        }
      />
      <LabelledField
        label={`URL`}
        field={
          <BankInput
            name={`source.url`}
            showField={showField}
            defaultValue={source?.url}
          />
        }
      />
      <LabelledField
        label={`URL Acc. Date`}
        field={
          <BankInput
            name={`source.url_access_date`}
            showField={showField}
            defaultValue={source?.url_access_date}
          />
        }
      />
    </>
  )
}
