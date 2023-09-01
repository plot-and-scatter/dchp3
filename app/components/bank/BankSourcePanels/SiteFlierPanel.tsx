import { BankSourceTypeEnum } from "~/models/bank.types"
import BankInput from "../BankInput"
import LabelledField from "../LabelledField"
import type { BankEditCitationFieldsProps } from "../BankEditCitationFields"

export default function SiteFlierPanel(props: BankEditCitationFieldsProps) {
  const citation = props.citation
  const source = citation?.source

  const showField = source?.type_id === BankSourceTypeEnum["Site/Flier"]

  return (
    <>
      <LabelledField
        label={`Year Pub`}
        field={
          <BankInput
            name={`source.year_published`}
            showField={showField}
            defaultValue={source?.year_published}
          />
        }
      />
      <LabelledField
        label={`Year Comp`}
        field={
          <BankInput
            name={`source.year_composed`}
            showField={showField}
            defaultValue={source?.year_composed}
          />
        }
      />
      <LabelledField
        label={`Title of website`}
        field={
          <BankInput
            name={`title`}
            showField={showField}
            defaultValue={source?.title?.name}
          />
        }
      />
      <LabelledField
        label={`Date`}
        field={
          <BankInput
            name={`source.periodical_date`}
            showField={showField}
            defaultValue={source?.periodical_date}
          />
        }
      />
      <LabelledField
        label={`Author`}
        field={
          <BankInput
            name={`author`}
            showField={showField}
            defaultValue={source?.author?.name}
          />
        }
      />

      <LabelledField
        label={`Place`}
        field={
          <BankInput
            name={`place`}
            showField={showField}
            defaultValue={source?.place?.name}
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
      <LabelledField
        label={`Evidence for Cdn. Usage:`}
        field={
          <BankInput
            name={`source.evidence`}
            showField={showField}
            defaultValue={source?.evidence}
          />
        }
      />
    </>
  )
}
