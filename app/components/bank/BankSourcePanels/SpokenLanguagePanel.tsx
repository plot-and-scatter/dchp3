import { SourceTypeEnum } from "~/models/bank.types"
import BankInput from "../BankInput"
import LabelledField from "../LabelledField"
import type { EditCitationProps } from "../EditCitationProps"

export default function SpokenLanguagePanel(props: EditCitationProps) {
  const showField = props.citation.type_id === SourceTypeEnum["Spoken Language"]

  return (
    <>
      <LabelledField
        label={`Year Heard`}
        field={
          <BankInput
            name={``}
            showField={showField}
            defaultValue={props.citation.year_published}
          />
        }
      />
      <LabelledField
        label={`Year Recorded`}
        field={
          <BankInput
            name={``}
            showField={showField}
            defaultValue={props.citation.year_composed}
          />
        }
      />
      <LabelledField
        label={`Uttered By:`}
        field={
          <BankInput
            name={``}
            showField={showField}
            defaultValue={props.author}
          />
        }
      />
      <LabelledField
        label={`Media Name:`}
        field={
          <BankInput
            name={``}
            showField={showField}
            defaultValue={props.utterance.utterance_media}
          />
        }
      />
      <LabelledField
        label={`Broadcast Name:`}
        field={
          <BankInput
            name={``}
            showField={showField}
            defaultValue={props.utterance.utterance_broadcast}
          />
        }
      />
      <LabelledField
        label={`Date of Utterance:`}
        field={
          <BankInput
            name={``}
            showField={showField}
            defaultValue={props.utterance.periodical_date}
          />
        }
      />
      <LabelledField
        label={`Time Apx.:`}
        field={
          <BankInput
            name={``}
            showField={showField}
            defaultValue={props.utterance.utterance_time}
          />
        }
      />
      <LabelledField
        label={`Place:`}
        field={
          <BankInput
            name={``}
            showField={showField}
            defaultValue={props.place}
          />
        }
      />
      <LabelledField
        label={`Witnessed by:`}
        field={
          <BankInput
            name={``}
            showField={showField}
            defaultValue={props.utterance.utterance_witness}
          />
        }
      />
      <LabelledField
        label={`URL`}
        field={
          <BankInput
            name={``}
            showField={showField}
            defaultValue={props.utterance.url}
          />
        }
      />
      <LabelledField
        label={`URL Acc. Date`}
        field={
          <BankInput
            name={``}
            showField={showField}
            defaultValue={props.utterance.url_access_date}
          />
        }
      />
    </>
  )
}
