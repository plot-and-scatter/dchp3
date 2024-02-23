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
          />
        }
      />
      <LabelledField
        label={`Title`}
        field={
          <TextArea
            name={`title`}
            showField={showField}
            defaultValue={source?.title?.name}
            rows={3}
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
      <LabelledField
        label={`Page/Column`}
        field={
          <Input
            name={`source.page`}
            showField={showField}
            defaultValue={source?.page}
          />
        }
      />
    </>
  )
}
