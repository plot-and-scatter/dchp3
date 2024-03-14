import { resetFetcher } from "~/routes/api/reset-fetcher"
import { Form, useFetcher } from "@remix-run/react"
import { DefaultErrorBoundary } from "~/components/elements/DefaultErrorBoundary"
import type { CitationSearchLoaderData } from "~/routes/api/citations/$searchTerm[.json]"
import Input from "~/components/bank/Input"
import LabelledField from "~/components/bank/LabelledField"
import RadioOrCheckbox from "~/components/bank/RadioOrCheckbox"
import Button from "~/components/elements/LinksAndButtons/Button"
import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import { useState } from "react"
import { Link } from "~/components/elements/LinksAndButtons/Link"
import Select from "~/components/bank/Select"
import { PAGE_SIZE } from "~/services/bank/searchCitations"

interface QuotationAddingFormProps {
  meaningId: number
}

const citationSearchUrl = (
  searchTerm: string,
  {
    orderBy,
    orderDirection,
    page,
  }: { orderBy?: string; orderDirection?: string; page?: string }
) => {
  const url = `/api/citations/${searchTerm}.json`

  const searchParams = new URLSearchParams()
  searchParams.set("searchField", "citation")
  if (orderBy) searchParams.set("orderBy", orderBy)
  if (orderDirection) searchParams.set("orderDirection", orderDirection)
  if (page) searchParams.set("page", page)

  return `${url}?${searchParams.toString()}`
}

export default function QuotationAddingForm({
  meaningId,
}: QuotationAddingFormProps) {
  const citations = useFetcher<CitationSearchLoaderData>()
  const [orderByValue, setOrderByValue] = useState("")
  const [pageNumber, setPageNumber] = useState(1)

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event: any
  ) => {
    event.preventDefault()

    const searchText = event.target.elements.searchText.value
    const orderBy = event.target.elements.orderBy.value
    const orderDirection = event.target.elements.orderDirection.value
    const page = pageNumber.toString()

    setOrderByValue(orderBy)

    if (searchText.length >= 0) {
      // await resetFetcher(citations)
      const url = citationSearchUrl(`${searchText}`, {
        orderBy,
        orderDirection,
        page,
      })
      citations.load(url)
    } else {
      resetFetcher(citations)
    }
  }

  let citationNumStart = 1
  let citationNumEnd = 1
  let pageCountOptions = []

  if (citations.data) {
    citationNumStart = (+citations.data.pageNumber - 1) * PAGE_SIZE + 1
    citationNumEnd = citationNumStart + citations.data.citations.length - 1
    for (let i = 1; i <= citations.data.pageCount; i++) {
      pageCountOptions.push({ label: `${i}`, value: `${i}` })
    }
  }

  return (
    <div className="m-2 w-full p-2">
      <form onSubmit={onSubmit}>
        <div className="flex">
          <div className="w-full">
            <Input
              placeholder="Enter text to search citations by headword"
              name="searchText"
              // onChange={onChangeAction}
            />
            {citations.data && (
              <label className="block" htmlFor="pageNumber">
                Page number:
                <Select
                  name="pageNumber"
                  options={pageCountOptions}
                  onChange={(e) => setPageNumber(+e.target.value)}
                />
              </label>
            )}
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
                    { label: "Date Added (ID)", value: "dateAdded" },
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
          </div>
          <div className="w-24">
            {citations.state === "loading" && <div>Loading...</div>}
          </div>
        </div>
        <div className="mb-10">
          <Button appearance="primary" type="submit" className="mt-2">
            Search
          </Button>
        </div>
      </form>
      {citations.data && (
        <Form method="post">
          <strong>
            Showing {citationNumStart}–{citationNumEnd} of{" "}
            {citations.data.citationCount} citations
          </strong>
          <Button type="submit" className="ml-3">
            Link quotations
          </Button>
          <input
            type="hidden"
            name="entryEditorFormAction"
            value={EntryEditorFormActionEnum.ADD_QUOTATIONS}
          />
          <input type="hidden" name="meaningId" value={meaningId} />
          <div className="max-h-96 overflow-y-scroll">
            <ul>
              {citations.data.citations.map((citation) => (
                <li key={citation.id} className="flex flex-col justify-center">
                  <div className="flex items-center pr-5">
                    <input
                      type="checkbox"
                      name={`citationIds`}
                      value={citation.id}
                      className="mx-1 p-1"
                    />
                    <p>
                      <Link to={`/bank/edit/${citation.id}`}>
                        <CitationPrefix
                          citation={citation}
                          orderBy={orderByValue}
                        />
                        {citation.clipped_text}
                      </Link>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Form>
      )}
    </div>
  )
}

interface CitationPrefixProps {
  citation: any
  orderBy: string
}

function CitationPrefix({ citation, orderBy }: CitationPrefixProps) {
  const prefixText = {
    dateAdded: citation.id,
    year: citation.source?.year_published,
    place: citation.source?.place?.name,
  }[orderBy]

  if (prefixText === undefined || prefixText === null || prefixText === "")
    return <></>

  return <strong>{prefixText}:</strong>
}

export const ErrorBoundary = DefaultErrorBoundary
