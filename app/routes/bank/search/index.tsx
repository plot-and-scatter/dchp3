import { BankLegacyTypeEnum, BankSourceTypeEnum } from "~/models/bank.types"
import { DefaultErrorBoundary } from "~/components/elements/DefaultErrorBoundary"
import { enumToSelectOptions } from "~/utils/inputUtils"
import { Form } from "@remix-run/react"
import { getStringFromFormInput } from "~/utils/generalUtils"
import { json, redirect } from "@remix-run/server-runtime"
import { PageHeader } from "~/components/elements/PageHeader"
import { z } from "zod"
import BankInput from "~/components/bank/BankInput"
import BankNumericInput from "~/components/bank/BankNumericInput"
import BankRadioOrCheckbox from "~/components/bank/BankRadioOrCheckbox"
import BankSelect from "~/components/bank/BankSelect"
import Button from "~/components/elements/Button"
import LabelledField from "~/components/bank/LabelledField"
import type { ActionArgs } from "@remix-run/server-runtime"

export const SEARCH_PARAMS = [
  "exactPhrase",
  "caseSensitive",
  "searchField",
  "legacyType",
  "sourceType",
  "sourceFloorYear",
  "sourceCeilingYear",
  "placeName",
  "orderBy",
  "orderDirection",
  "horizon",
  "page",
]

const BankCitationSearchFormDataSchema = z.object({
  [`searchTerm`]: z.string().nullable(),
})

export const action = async ({ request }: ActionArgs) => {
  const data = Object.fromEntries(await request.formData())
  const parsedData = BankCitationSearchFormDataSchema.parse(data)

  console.log("--->>>> request", request)

  const searchTerm = parsedData["searchTerm"]
  if (!searchTerm)
    throw json({ message: "Search term missing from search" }, { status: 400 })

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
    <Form method="POST" className="flex flex-col gap-y-4">
      <PageHeader>Search</PageHeader>
      <LabelledField
        label="Search term"
        field={<BankInput name="searchTerm" />}
      />
      <LabelledField
        label="Select"
        field={
          <div className="flex">
            <BankRadioOrCheckbox
              type="checkbox"
              name="exactPhrase"
              className="flex"
              optionSetClassName="flex gap-x-2 mr-4"
              options={[{ name: "Exact phrase", value: "exactPhrase" }]}
            />
            <BankRadioOrCheckbox
              type="checkbox"
              name="caseSensitive"
              className="flex"
              optionSetClassName="flex gap-x-2 mr-4"
              options={[
                {
                  name: "Case sensitive [not implemented]",
                  value: "caseSensitive",
                },
              ]}
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
            name="legacyType"
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
            name="sourceType"
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
          <BankRadioOrCheckbox
            type="radio"
            className="flex"
            optionSetClassName="flex gap-x-2 mr-4"
            name="orderBy"
            defaultValue={"year"}
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
          <BankRadioOrCheckbox
            type="radio"
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
          <BankRadioOrCheckbox
            type="radio"
            className="flex"
            optionSetClassName="flex gap-x-2 mr-4"
            name="horizon"
            defaultValue="all"
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
      <input type="hidden" name="page" value="1" />
      <Button appearance="primary" className="w-fit" size="large" type="submit">
        <i className="fas fa-search mx-auto mr-4" />
        Search
      </Button>
    </Form>
  )
}

export const ErrorBoundary = DefaultErrorBoundary
