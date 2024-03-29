import { BankLegacyTypeEnum, BankSourceTypeEnum } from "~/models/bank.types"
import { DefaultErrorBoundary } from "~/components/elements/DefaultErrorBoundary"
import { enumToOptions } from "~/utils/inputUtils"
import { Form } from "@remix-run/react"
import { getStringFromFormInput } from "~/utils/generalUtils"
import { json, redirect } from "@remix-run/server-runtime"
import { PageHeader } from "~/components/elements/Headings/PageHeader"
import { z } from "zod"
import Input from "~/components/bank/Input"
import NumericInput from "~/components/bank/NumericInput"
import RadioOrCheckbox from "~/components/bank/RadioOrCheckbox"
import Select from "~/components/bank/Select"
import Button from "~/components/elements/LinksAndButtons/Button"
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
      <LabelledField label="Search term" field={<Input name="searchTerm" />} />
      <LabelledField
        label="Select"
        field={
          <div className="flex">
            <RadioOrCheckbox
              type="checkbox"
              name="exactPhrase"
              className="flex"
              optionSetClassName="flex gap-x-2 mr-4"
              options={[{ label: "Exact phrase", value: "exactPhrase" }]}
            />
            <RadioOrCheckbox
              type="checkbox"
              name="caseSensitive"
              className="flex"
              optionSetClassName="flex gap-x-2 mr-4"
              options={[
                {
                  label: "Case sensitive [not implemented]",
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
          <Select
            name="searchField"
            options={[
              { label: "Citation (Full Text)", value: "citation" },
              { label: "Headword", value: "headword" },
            ]}
          />
        }
      />
      <LabelledField
        label="Data type"
        field={
          <Select
            name="legacyType"
            options={[
              { label: "All", value: "all" },
              ...enumToOptions(BankLegacyTypeEnum),
            ]}
          />
        }
      />
      <LabelledField
        label="Source type"
        field={
          <Select
            name="sourceType"
            options={[
              { label: "All", value: "all" },
              ...enumToOptions(BankSourceTypeEnum),
            ]}
          />
        }
      />
      <LabelledField
        label="Source floor (year)"
        field={<NumericInput name="sourceFloorYear" />}
      />
      <LabelledField
        label="Source ceiling (year)"
        field={<NumericInput name="sourceCeilingYear" />}
      />
      <LabelledField label="Place" field={<Input name="placeName" />} />
      <LabelledField
        label="Sort by"
        field={
          <RadioOrCheckbox
            type="radio"
            className="flex"
            optionSetClassName="flex gap-x-2 mr-4"
            name="orderBy"
            defaultValue={"year"}
            options={[
              { label: "Date Added", value: "dateAdded" },
              { label: "Year Published / Composed", value: "year" },
              { label: "Place", value: "place" },
            ]}
          />
        }
      />
      <LabelledField
        label="Order"
        field={
          <RadioOrCheckbox
            type="radio"
            className="flex"
            optionSetClassName="flex gap-x-2 mr-4"
            name="orderDirection"
            defaultValue={"asc"}
            options={[
              { label: "Ascending", value: "asc" },
              { label: "Descending", value: "desc" },
            ]}
          />
        }
      />
      <LabelledField
        label="Horizon"
        field={
          <RadioOrCheckbox
            type="radio"
            className="flex"
            optionSetClassName="flex gap-x-2 mr-4"
            name="horizon"
            defaultValue="all"
            options={[
              { label: "All", value: "all" },
              { label: "5", value: "5" },
              { label: "10", value: "10" },
              { label: "15", value: "15" },
              { label: "25", value: "25" },
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
