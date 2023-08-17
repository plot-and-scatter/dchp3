import { BankSourceTypeEnum } from "~/models/bank.types"
import BankInput from "../BankInput"
import BankTextArea from "../BankTextArea"
import LabelledField from "../LabelledField"
import type { EditCitationProps } from "../EditCitationProps"

export default function BookPanel(props: EditCitationProps) {
  const showField = props.citation?.type_id === BankSourceTypeEnum.Book

  return (
    <>
      <LabelledField
        label={`Year Pub`}
        field={
          <BankInput
            name={`source.year_published`}
            showField={showField}
            defaultValue={props.citation?.year_published}
          />
        }
      />
      <LabelledField
        label={`Year Comp`}
        field={
          <BankInput
            name={`source.year_composed`}
            showField={showField}
            defaultValue={props.citation?.year_composed}
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
        label={`Editor`}
        field={
          <BankInput
            name={`source.editor`}
            showField={showField}
            defaultValue={props.source?.editor}
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
        label={`Publisher`}
        field={
          <BankInput
            name={`source.publisher`}
            showField={showField}
            defaultValue={props.source?.publisher}
          />
        }
      />
      <LabelledField
        label={`URL`}
        field={
          <BankInput
            name={`source.url`}
            showField={showField}
            defaultValue={props.source?.url}
          />
        }
      />
      <LabelledField
        label={`URL Acc. Date`}
        field={
          <BankInput
            name={`source.url_access_date`}
            showField={showField}
            defaultValue={props.source?.url_access_date}
          />
        }
      />
      <LabelledField
        label={`Page`}
        field={
          <BankInput
            name={`source.page`}
            showField={showField}
            defaultValue={props.citation?.page}
          />
        }
      />
    </>
  )
}
