import { BankSourceTypeEnum } from "~/models/bank.types"
import Input from "../Input"
import TextArea from "../TextArea"
import LabelledField from "../LabelledField"
import type { BankEditCitationFieldsProps } from "../BankEditCitationFields"

export default function PeriodicalPanel(props: BankEditCitationFieldsProps) {
  const citation = props.citation
  const source = citation?.source

  const showField = source?.type_id === BankSourceTypeEnum.Periodical

  return (
    <>
      <LabelledField
        label={`Year Pub`}
        field={
          <Input
            name={`source.year_published`}
            showField={showField}
            defaultValue={source?.year_published}
            placeholder="e.g. 1861 (numbers ONLY)"
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
            placeholder="e.g. 1793-1796 (numbers and hyphens ONLY)"
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
        label={`Title of Per:`}
        field={
          <TextArea
            name={`title`}
            showField={showField}
            defaultValue={source?.title?.name}
            rows={3}
            placeholder="e.g. The Globe and Mail"
          />
        }
      />
      <LabelledField
        label={`Date of Per:`}
        field={
          <Input
            name={`source.periodical_date`}
            showField={showField}
            defaultValue={source?.periodical_date}
            placeholder="e.g. 31 Mar. 1849"
          />
        }
      />
      <LabelledField
        label={`Place Publ:`}
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
        label={`Place Dateline`}
        field={
          <Input
            name={`source.dateline`}
            showField={showField}
            defaultValue={source?.dateline}
            placeholder="e.g. "
          />
        }
      />
      <LabelledField
        label={`Volume (Issue):`}
        field={
          <Input
            name={`source.volume_issue`}
            showField={showField}
            defaultValue={source?.volume_issue}
            placeholder="e.g. 29(4) — only when applicable (numbers and parentheses ONLY)"
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
        label={`Page/Column`}
        field={
          <Input
            name={`source.page`}
            showField={showField}
            defaultValue={source?.page}
            placeholder="e.g. B13"
          />
        }
      />
    </>
  )
}
