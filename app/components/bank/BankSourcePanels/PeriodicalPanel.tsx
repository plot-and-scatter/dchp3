import { SourceTypeEnum } from "~/models/bank.types"
import BankInput from "../BankInput"
import BankTextArea from "../BankTextArea"
import LabelledField from "../LabelledField"
import type { EditCitationProps } from "../EditCitationProps"

export default function PeriodicalPanel(props: EditCitationProps) {
  const showField = props.citation.type_id === SourceTypeEnum.Periodical

  return (
    <>
      <LabelledField
        label={`Year Pub`}
        field={
          <BankInput
            name={`citation.year_published`}
            showField={showField}
            defaultValue={props.citation.year_published}
          />
        }
      />
      <LabelledField
        label={`Year Comp`}
        field={
          <BankInput
            name={`citation.year_composed`}
            showField={showField}
            defaultValue={props.citation.year_composed}
          />
        }
      />
      <LabelledField
        label={`Author`}
        field={
          <BankInput
            name={`author`}
            showField={showField}
            defaultValue={props.author}
          />
        }
      />
      <LabelledField
        label={`Title`}
        field={
          <BankTextArea
            name={`title`}
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
            name={`utterance.periodical_date`}
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
            name={`utterance.dateline`}
            showField={showField}
            defaultValue={props.utterance.dateline}
          />
        }
      />
      <LabelledField
        label={`Volume (Issue):`}
        field={
          <BankInput
            name={`utterance.volume_issue`}
            showField={showField}
            defaultValue={props.utterance.volume_issue}
          />
        }
      />
      <LabelledField
        label={`URL`}
        field={
          <BankInput
            name={`utterance.url`}
            showField={showField}
            defaultValue={props.utterance.url}
          />
        }
      />
      <LabelledField
        label={`URL Acc. Date`}
        field={
          <BankInput
            name={`utterance.url_access_date`}
            showField={showField}
            defaultValue={props.utterance.url_access_date}
          />
        }
      />
      <LabelledField
        label={`Page/Column`}
        field={
          <BankInput
            name={`citation.page`}
            showField={showField}
            defaultValue={props.citation.page}
          />
        }
      />
    </>
  )
}
