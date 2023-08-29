import { BankLegacyTypeEnum, BankSourceTypeEnum } from "~/models/bank.types"
import { enumToSelectOptions } from "~/utils/inputUtils"
import { Form } from "@remix-run/react"
import { getStringFromFormInput } from "~/utils/generalUtils"
import { json, redirect } from "@remix-run/server-runtime"
import { PageHeader } from "~/components/elements/PageHeader"
import BankCheckbox from "~/components/bank/BankCheckbox"
import BankInput from "~/components/bank/BankInput"
import BankNumericInput from "~/components/bank/BankNumericInput"
import BankRadio from "~/components/bank/BankRadio"
import BankSelect from "~/components/bank/BankSelect"
import Button from "~/components/elements/Button"
import LabelledField from "~/components/bank/LabelledField"
import type { ActionArgs } from "@remix-run/server-runtime"

export const SEARCH_PARAMS = [
  "exactPhrase",
  "caseSensitive",
  "searchField",
  "dataType",
  "sourceFloorYear",
  "sourceCeilingYear",
  "placeName",
  "orderBy",
  "orderDirection",
  "horizon",
]

export const action = async ({ request }: ActionArgs) => {
  const data = Object.fromEntries(await request.formData())

  console.log("data", data)

  const searchTerm = getStringFromFormInput(data["searchTerm"])
  if (!searchTerm) throw json({ message: "Search term missing from search" })

  const searchParams = SEARCH_PARAMS.map((key) => ({
    key,
    value: getStringFromFormInput(data[key]),
  }))

  const base = new URL(request.url)
  const url = new URL(`/bank/search/${searchTerm}`, base)

  searchParams.forEach((kv) => {
    if (kv.value) url.searchParams.set(kv.key, kv.value)
  })

  return redirect(url.toString())
}

export const loader = async () => {
  return null
}

export default function SearchIndex() {
  return (
    <>
      <PageHeader>Search</PageHeader>
      <Form
        method="post"
        className="flex flex-col gap-y-4"
        action="/bank/search"
      >
        <LabelledField
          label="Search term"
          field={<BankInput name="searchTerm" />}
        />
        <LabelledField
          label="Select"
          field={
            <div className="flex">
              <BankCheckbox
                name="exactPhrase"
                className="flex"
                optionSetClassName="flex gap-x-2 mr-4"
                options={[{ name: "Exact phrase", value: "exactPhrase" }]}
              />
              <BankCheckbox
                name="caseSensitive"
                className="flex"
                optionSetClassName="flex gap-x-2 mr-4"
                options={[{ name: "Case sensitive", value: "caseSensitive" }]}
              />
            </div>
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
          label="Source floor (year)"
          field={<BankNumericInput name="sourceFloorYear" />}
        />
        <LabelledField
          label="Source ceiling (year)"
          field={<BankNumericInput name="sourceCeilingYear" />}
        />
        <LabelledField label="Place" field={<BankInput name="placeName" />} />
        <LabelledField
          label="Sort by"
          field={
            <BankRadio
              className="flex"
              optionSetClassName="flex gap-x-2 mr-4"
              name="orderBy"
              defaultValue={"dateAdded"}
              options={[
                { name: "Date Added", value: "dateAdded" },
                { name: "Year Published / Composed", value: "year" },
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
              name="orderDirection"
              defaultValue={"asc"}
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
              defaultValue="15"
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
        <Button
          appearance="primary"
          className="w-fit"
          size="large"
          type="submit"
        >
          <i className="fas fa-search mx-auto mr-4" />
          Search
        </Button>
      </Form>
    </>
  )
}
