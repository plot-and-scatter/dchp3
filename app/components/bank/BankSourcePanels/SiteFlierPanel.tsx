import { BankSourceTypeEnum } from "~/models/bank.types"
import Input from "../Input"
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
          <Input
            name={`source.year_published`}
            showField={showField}
            defaultValue={source?.year_published}
            placeholder="if no other indicator, access year, e.g. 2008"
          />
        }
      />
      <LabelledField
        label={`Year Comp`}
        field={
          <Input
            name={`source.year_composed`}
            showField={showField}
            defaultValue={source?.year_composed}
            placeholder="if older text reprinted on site, e.g. 1971"
          />
        }
      />
      <LabelledField
        label={`Title of website`}
        field={
          <Input
            name={`title`}
            showField={showField}
            defaultValue={source?.title?.name}
            placeholder="e.g. DCHP-3 Homepage, UBC Homepage"
          />
        }
      />
      <LabelledField
        label={`Date`}
        field={
          <Input
            name={`source.periodical_date`}
            showField={showField}
            defaultValue={source?.periodical_date}
            placeholder="if available, e.g. 31 Mar. 2006"
          />
        }
      />
      <LabelledField
        label={`Author`}
        field={
          <Input
            name={`author`}
            showField={showField}
            defaultValue={source?.author?.name}
            placeholder="e.g. Johnston, John L."
          />
        }
      />

      <LabelledField
        label={`Place`}
        field={
          <Input
            name={`place`}
            showField={showField}
            defaultValue={source?.place?.name}
            placeholder="e.g. Toronto, ON; London, UK; New York, USA"
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
            placeholder="enter URL if electronic resource"
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
            placeholder="e.g. 1 Jul. 2007"
          />
        }
      />
      <LabelledField
        label={`Evidence for Cdn. Usage:`}
        field={
          <Input
            name={`source.evidence`}
            showField={showField}
            defaultValue={source?.evidence}
            placeholder="e.g. author says she is an Edmontonian"
          />
        }
      />
    </>
  )
}
