import { BankSourceTypeEnum } from "~/models/bank.types"
import BankInput from "../BankInput"
import BankTextArea from "../BankTextArea"
import LabelledField from "../LabelledField"
import type { BankEditCitationFieldsProps } from "../BankEditCitationFields"

export default function BookPanel(props: BankEditCitationFieldsProps) {
  const citation = props.citation
  const source = citation?.source

  const showField = source?.type_id === BankSourceTypeEnum.Book

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
        label={`Editor`}
        field={
          <BankInput
            name={`source.editor`}
            showField={showField}
            defaultValue={source?.editor}
          />
        }
      />
      <LabelledField
        label={`Title`}
        field={
          <BankTextArea
            name={`title`}
            showField={showField}
            defaultValue={source?.title?.name}
            rows={3}
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
        label={`Publisher`}
        field={
          <BankInput
            name={`source.publisher`}
            showField={showField}
            defaultValue={source?.publisher}
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
        label={`Page`}
        field={
          <BankInput
            name={`source.page`}
            showField={showField}
            defaultValue={source?.page}
          />
        }
      />
    </>
  )
}
