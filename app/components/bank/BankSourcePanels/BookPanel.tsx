import { SourceTypeEnum } from "~/models/bank.types"
import BankInput from "../BankInput"
import BankTextArea from "../BankTextArea"
import LabelledField from "../LabelledField"
import type { BankSourcePanelProps } from "./BankSourcePanel"

export default function BookPanel(props: BankSourcePanelProps) {
  const showField = props.citation.type_id === SourceTypeEnum.Book

  return (
    <>
      <LabelledField
        label={`Year Pub`}
        field={
          <BankInput
            name={``}
            showField={showField}
            defaultValue={props.citation.year_published}
          />
        }
      />
      <LabelledField
        label={`Year Comp`}
        field={
          <BankInput
            name={``}
            showField={showField}
            defaultValue={props.citation.year_composed}
          />
        }
      />
      <LabelledField
        label={`Author`}
        field={
          <BankInput
            name={``}
            showField={showField}
            defaultValue={props.author}
          />
        }
      />
      <LabelledField
        label={`Editor`}
        field={
          <BankInput
            name={``}
            showField={showField}
            defaultValue={props.utterance.editor}
          />
        }
      />
      <LabelledField
        label={`Title`}
        field={
          <BankTextArea
            name={``}
            showField={showField}
            defaultValue={props.title}
            rows={3}
          />
        }
      />
      <LabelledField
        label={`Place`}
        field={
          <BankInput
            name={``}
            showField={showField}
            defaultValue={props.place}
          />
        }
      />
      <LabelledField
        label={`Publisher`}
        field={
          <BankInput
            name={``}
            showField={showField}
            defaultValue={props.utterance.publisher}
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
      <LabelledField
        label={`Page`}
        field={
          <BankInput
            name={``}
            showField={showField}
            defaultValue={props.citation.page}
          />
        }
      />
    </>
  )
}
