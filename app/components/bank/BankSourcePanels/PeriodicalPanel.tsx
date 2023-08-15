import { SourceTypeEnum } from "~/models/citation.types"
import BankInput from "../BankInput"
import BankTextArea from "../BankTextArea"
import LabelledField from "../LabelledField"
import type { BankSourcePanelProps } from "./BankSourcePanel"

export default function PeriodicalPanel(props: BankSourcePanelProps) {
  const showField = props.citation.type_id === SourceTypeEnum.Periodical

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
        label={`Date of Per:`}
        field={
          <BankInput
            name={``}
            showField={showField}
            defaultValue={props.utterance.periodical_date}
          />
        }
      />
      <LabelledField
        label={`Place Publ:`}
        field={
          <BankInput
            name={``}
            showField={showField}
            defaultValue={props.place}
          />
        }
      />
      <LabelledField
        label={`Place Dateline`}
        field={
          <BankInput
            name={``}
            showField={showField}
            defaultValue={props.utterance.dateline}
          />
        }
      />
      <LabelledField
        label={`Volume (Issue):`}
        field={
          <BankInput
            name={``}
            showField={showField}
            defaultValue={props.utterance.volume_issue}
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
        label={`Page/Column`}
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
