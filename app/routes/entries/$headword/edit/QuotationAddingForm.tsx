import { resetFetcher } from "~/routes/api/reset-fetcher"
import { Form, useFetcher } from "@remix-run/react"
import { DefaultErrorBoundary } from "~/components/elements/DefaultErrorBoundary"
import type { CitationSearchLoaderData } from "~/routes/api/citations/$searchTerm.$pageNumber[.json]"
import BankInput from "~/components/bank/BankInput"
import LabelledField from "~/components/bank/LabelledField"
import BankRadioOrCheckbox from "~/components/bank/BankRadioOrCheckbox"
import Button from "~/components/elements/LinksAndButtons/Button"
import { attributeEnum } from "~/components/editing/attributeEnum"
import { useState } from "react"
import { Link } from "~/components/elements/LinksAndButtons/Link"

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
  searchParams.set("searchField", "headword") // should this be headword or citation?
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
      citations.load(
        citationSearchUrl(searchText, { orderBy, orderDirection, page })
      )
    } else {
      resetFetcher(citations)
    }
  }

  return (
    <div className="m-2 w-full p-2">
      <form onSubmit={onSubmit}>
        <div className="flex">
          <div className="w-full">
            <BankInput
              placeholder="Enter text to search citations by headword"
              name="searchText"
              // onChange={onChangeAction}
            />
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
                <BankRadioOrCheckbox
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
          {citations.data && (
            <>
              <Button
                type="submit"
                className="ml-10 mt-2"
                onClick={(e) => setPageNumber(Math.max(pageNumber - 1, 1))}
              >
                Prev Page
              </Button>
              <Button
                type="submit"
                className="ml-2 mt-2"
                onClick={(e) => setPageNumber(pageNumber + 1)}
              >
                Next Page
              </Button>
            </>
          )}
        </div>
      </form>
      {citations.data && (
        <Form method="post">
          <strong>
            {citations.data.citations.length} citations (temp max 100)
          </strong>
          <Button type="submit" className="ml-3">
            Add Quotations
          </Button>
          <input
            type="hidden"
            name="attributeType"
            value={attributeEnum.QUOTATION}
          />
          <input type="hidden" name="meaningId" value={meaningId} />
          <div className="max-h-96 overflow-y-scroll">
            <ul>
              {citations.data.citations.map((citation) => (
                <li key={citation.id} className="flex flex-col justify-center">
                  <div className="flex items-center pr-5">
                    <input
                      type="checkbox"
                      name={`citationId-${citation.id}`}
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
