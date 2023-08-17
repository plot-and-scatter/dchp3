import { BankSourceTypeEnum } from "~/models/bank.types"
import BankInput from "../BankInput"
import LabelledField from "../LabelledField"
import type { EditCitationProps } from "../EditCitationProps"

export default function SpokenLanguagePanel(props: EditCitationProps) {
  const showField =
    props.citation?.type_id === BankSourceTypeEnum["Spoken Language"]

  return (
    <>
      <LabelledField
        label={`Year Heard`}
        field={
          <BankInput
            name={`source.year_published`}
            showField={showField}
            defaultValue={props.citation?.year_published}
          />
        }
      />
      <LabelledField
        label={`Year Recorded`}
        field={
          <BankInput
            name={`source.year_composed`}
            showField={showField}
            defaultValue={props.citation?.year_composed}
          />
        }
      />
      <LabelledField
        label={`Uttered By:`}
        field={
          <BankInput
            name={`author`}
            showField={showField}
            defaultValue={props.author}
          />
        }
      />
      <LabelledField
        label={`Media Name:`}
        field={
          <BankInput
            name={`source.utterance_media`}
            showField={showField}
            defaultValue={props.source?.utterance_media}
          />
        }
      />
      <LabelledField
        label={`Broadcast Name:`}
        field={
          <BankInput
            name={`source.utterance_broadcast`}
            showField={showField}
            defaultValue={props.source?.utterance_broadcast}
          />
        }
      />
      <LabelledField
        label={`Date of Utterance:`}
        field={
          <BankInput
            name={`source.periodical_date`}
            showField={showField}
            defaultValue={props.source?.periodical_date}
          />
        }
      />
      <LabelledField
        label={`Time Apx.:`}
        field={
          <BankInput
            name={`source.utterance_time`}
            showField={showField}
            defaultValue={props.source?.utterance_time}
          />
        }
      />
      <LabelledField
        label={`Place:`}
        field={
          <BankInput
            name={`place`}
            showField={showField}
            defaultValue={props.place}
          />
        }
      />
      <LabelledField
        label={`Witnessed by:`}
        field={
          <BankInput
            name={`source.utterance_witness`}
            showField={showField}
            defaultValue={props.source?.utterance_witness}
          />
        }
      />
      <LabelledField
        label={`URL`}
        field={
          <BankInput
            name={`source.url`}
            showField={showField}
            defaultValue={props.source?.url}
          />
        }
      />
      <LabelledField
        label={`URL Acc. Date`}
        field={
          <BankInput
            name={`source.url_access_date`}
            showField={showField}
            defaultValue={props.source?.url_access_date}
          />
        }
      />
    </>
  )
}
