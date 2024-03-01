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
          />
        }
      />
    </>
  )
}
