import { BankSourceTypeEnum } from "~/models/bank.types"
import BankInput from "../BankInput"
import LabelledField from "../LabelledField"
import type { EditCitationProps } from "../EditCitationProps"

export default function SiteFlierPanel(props: EditCitationProps) {
  const showField = props.citation.type_id === BankSourceTypeEnum["Site/Flier"]

  return (
    <>
      <LabelledField
        label={`Year Pub`}
        field={
          <BankInput
            name={`source.year_published`}
            showField={showField}
            defaultValue={props.citation.year_published}
          />
        }
      />
      <LabelledField
        label={`Year Comp`}
        field={
          <BankInput
            name={`source.year_composed`}
            showField={showField}
            defaultValue={props.citation.year_composed}
          />
        }
      />
      <LabelledField
        label={`Title of website`}
        field={
          <BankInput
            name={`title`}
            showField={showField}
            defaultValue={props.title}
          />
        }
      />
      <LabelledField
        label={`Date`}
        field={
          <BankInput
            name={`source.periodical_date`}
            showField={showField}
            defaultValue={props.source.periodical_date}
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
        label={`Place`}
        field={
          <BankInput
            name={`place`}
            showField={showField}
            defaultValue={props.place}
          />
        }
      />
      <LabelledField
        label={`URL`}
        field={
          <BankInput
            name={`source.url`}
            showField={showField}
            defaultValue={props.source.url}
          />
        }
      />
      <LabelledField
        label={`URL Acc. Date`}
        field={
          <BankInput
            name={`source.url_access_date`}
            showField={showField}
            defaultValue={props.source.url_access_date}
          />
        }
      />
      <LabelledField
        label={`Evidence for Cdn. Usage:`}
        field={
          <BankInput
            name={`source.evidence`}
            showField={showField}
            defaultValue={props.source.evidence}
          />
        }
      />
    </>
  )
}
