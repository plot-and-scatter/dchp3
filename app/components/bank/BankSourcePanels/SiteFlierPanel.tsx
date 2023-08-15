import { SourceTypeEnum } from "~/models/citation.types"
import BankInput from "../BankInput"
import LabelledField from "../LabelledField"
import type { BankSourcePanelProps } from "./BankSourcePanel"

export default function SiteFlierPanel(props: BankSourcePanelProps) {
  const showField = props.citation.type_id === SourceTypeEnum["Site/Flier"]

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
        label={`Title of website`}
        field={
          <BankInput
            name={``}
            showField={showField}
            defaultValue={props.title}
          />
        }
      />
      <LabelledField
        label={`Date`}
        field={
          <BankInput
            name={``}
            showField={showField}
            defaultValue={props.utterance.periodical_date}
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
        label={`Evidence for Cdn. Usage:`}
        field={
          <BankInput
            name={``}
            showField={showField}
            defaultValue={props.utterance.evidence}
          />
        }
      />
    </>
  )
}
