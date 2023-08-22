import { Form } from "@remix-run/react"
import BankCheckbox from "~/components/bank/BankCheckbox"
import BankInput from "~/components/bank/BankInput"
import BankNumericInput from "~/components/bank/BankNumericInput"
import BankRadio from "~/components/bank/BankRadio"
import BankSelect from "~/components/bank/BankSelect"
import LabelledField from "~/components/bank/LabelledField"
import Button from "~/components/elements/Button"
import { PageHeader } from "~/components/elements/PageHeader"
import { BankLegacyTypeEnum, BankSourceTypeEnum } from "~/models/bank.types"
import { enumToSelectOptions } from "~/utils/inputUtils"

export const action = () => {}

export default function SearchIndex() {
  return (
    <>
      <PageHeader>Search</PageHeader>
      <Form method="post" className="flex flex-col gap-y-4">
        <LabelledField
          label="Search term"
          field={<BankInput name="searchTerm" />}
        />
        <LabelledField
          label="Select"
          field={
            <BankCheckbox
              name="select"
              className="flex"
              optionSetClassName="flex gap-x-2 mr-4"
              options={[
                { name: "Case sensitive", value: "caseSensitive" },
                { name: "Exact phrase", value: "exactPhrase" },
              ]}
            />
          }
        />
        <LabelledField
          label="Search field"
          field={
            <BankSelect
              name="searchField"
              options={[
                { name: "Citation (Full Text)", value: "citation" },
                { name: "Headword", value: "headword" },
              ]}
            />
          }
        />
        <LabelledField
          label="Data type"
          field={
            <BankSelect
              name="dataType"
              options={[
                { name: "All", value: "all" },
                ...enumToSelectOptions(BankLegacyTypeEnum),
              ]}
            />
          }
        />
        <LabelledField
          label="Source type"
          field={
            <BankSelect
              name="dataType"
              options={[
                { name: "All", value: "all" },
                ...enumToSelectOptions(BankSourceTypeEnum),
              ]}
            />
          }
        />

        <LabelledField
          label="Source floor"
          field={<BankNumericInput name="sourceFloor" />}
        />
        <LabelledField
          label="Source ceiling"
          field={<BankNumericInput name="sourceCeiling" />}
        />
        <LabelledField label="Place" field={<BankInput name="place" />} />
        <LabelledField
          label="Sort by"
          field={
            <BankRadio
              className="flex"
              optionSetClassName="flex gap-x-2 mr-4"
              name="sortBy"
              options={[
                { name: "Year Published / Composed", value: "year" },
                { name: "Date Added", value: "dateAdded" },
                { name: "Place", value: "place" },
              ]}
            />
          }
        />
        <LabelledField
          label="Order"
          field={
            <BankRadio
              className="flex"
              optionSetClassName="flex gap-x-2 mr-4"
              name="order"
              options={[
                { name: "Ascending", value: "asc" },
                { name: "Descending", value: "desc" },
              ]}
            />
          }
        />
        <LabelledField
          label="Horizon"
          field={
            <BankRadio
              className="flex"
              optionSetClassName="flex gap-x-2 mr-4"
              name="horizon"
              options={[
                { name: "All", value: "all" },
                { name: "5", value: "5" },
                { name: "10", value: "10" },
                { name: "15", value: "15" },
                { name: "25", value: "25" },
              ]}
            />
          }
        />
        <Button appearance="primary" className="w-fit" size="large">
          <i className="fas fa-search mx-auto mr-4" />
          Search
        </Button>
      </Form>
    </>
  )
}
