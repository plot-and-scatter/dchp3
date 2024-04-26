import { resetFetcher } from "~/routes/api/reset-fetcher"
import { Form, useFetcher } from "@remix-run/react"
import { DefaultErrorBoundary } from "~/components/elements/DefaultErrorBoundary"
import type { CitationSearchLoaderData } from "~/routes/api/citations/$searchTerm[.json]"
import Input from "~/components/bank/Input"
import RadioOrCheckbox from "~/components/bank/RadioOrCheckbox"
import Button from "~/components/elements/LinksAndButtons/Button"
import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import React, { useRef, useState } from "react"
import { Link } from "~/components/elements/LinksAndButtons/Link"
import Select from "~/components/bank/Select"
import { PAGE_SIZE } from "~/services/bank/searchCitations"
import TopLabelledField from "~/components/bank/TopLabelledField"
import FAIcon from "~/components/elements/Icons/FAIcon"
import SaveIcon from "~/components/elements/Icons/SaveIcon"
import { QuaternaryHeader } from "~/components/elements/Headings/QuaternaryHeader"
import AddIcon from "~/components/elements/Icons/AddIcon"
import EditIcon from "~/components/elements/Icons/EditIcon"

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
  const [previousSearchText, setPreviousSearchText] = useState("")
  const [pageNumber, setPageNumber] = useState("1")

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event: any
  ) => {
    event.preventDefault()

    const searchText = event.target.elements.searchText.value
    const orderBy = event.target.elements.orderBy.value
    const orderDirection = event.target.elements.orderDirection.value
    const pageNumber =
      previousSearchText === searchText
        ? event.target.elements.pageNumber?.value || "1"
        : "1"

    setOrderByValue(orderBy)
    setPreviousSearchText(searchText)
    setPageNumber(pageNumber)

    if (searchText.length >= 0) {
      // await resetFetcher(citations)
      const url = citationSearchUrl(`${searchText}`, {
        orderBy,
        orderDirection,
        page: pageNumber,
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

  const quotationSearchButtonRef = useRef<HTMLButtonElement>(null)

  return (
    <div className="w-full">
      <QuaternaryHeader>
        <AddIcon /> Add quotations
      </QuaternaryHeader>
      <Form onSubmit={onSubmit} reloadDocument={false}>
        <div className="flex w-full items-center">
          <div className="flex w-full items-start gap-x-4">
            <div className="flex-1">
              <TopLabelledField
                labelWidth="w-fit"
                label="Quotation text search"
                field={
                  <Input
                    placeholder="Enter text to search for in quotation body"
                    name="searchText"
                  />
                }
              />
            </div>
            <TopLabelledField
              label="Sort by"
              field={
                <RadioOrCheckbox
                  type="radio"
                  className="text-sm"
                  optionSetClassName="flex gap-x-2 mr-4"
                  name="orderBy"
                  direction="vertical"
                  defaultValue={"year"}
                  options={[
                    { label: "Date Added (ID)", value: "dateAdded" },
                    { label: "Year Pub. / Comp.", value: "year" },
                    { label: "Place", value: "place" },
                  ]}
                />
              }
            />
            <TopLabelledField
              label="Order"
              field={
                <RadioOrCheckbox
                  type="radio"
                  className="text-sm"
                  optionSetClassName="flex gap-x-2 mr-4"
                  name="orderDirection"
                  defaultValue={"asc"}
                  direction="vertical"
                  options={[
                    { label: "Ascending", value: "asc" },
                    { label: "Descending", value: "desc" },
                  ]}
                />
              }
            />
          </div>
          <div className="mb-4">
            <div>
              <Button
                appearance="primary"
                type="submit"
                className="mt-2 w-48 whitespace-nowrap text-left"
                ref={quotationSearchButtonRef}
              >
                <FAIcon iconName="fa-search" />{" "}
                {citations.state === "loading"
                  ? "Loading..."
                  : "Search quotations"}
              </Button>
            </div>
          </div>
        </div>

        {citations.data &&
          (citations.data.citations.length ? (
            <div className="mb-2 flex items-center">
              <div className="text-bold mr-4 flex items-center">
                Showing page&nbsp;
                <Select
                  name="pageNumber"
                  options={pageCountOptions}
                  value={pageNumber}
                  onChange={(e) => {
                    // setPageNumber(+e.target.value)
                    quotationSearchButtonRef.current?.click()
                  }}
                />
                &nbsp; ({citationNumStart}&ndash;
                {citationNumEnd} of {citations.data.citationCount} citations)
              </div>
            </div>
          ) : (
            <div className="mb-2">No citations found.</div>
          ))}
      </Form>
      {citations.data && citations.data.citations.length > 0 && (
        <Form method="post">
          <input
            type="hidden"
            name="entryEditorFormAction"
            value={EntryEditorFormActionEnum.ADD_QUOTATIONS}
          />
          <input type="hidden" name="meaningId" value={meaningId} />
          <div className="max-h-96 overflow-y-scroll rounded border border-amber-400 bg-amber-100 p-4 shadow">
            <ul className="flex flex-col gap-y-2">
              {citations.data.citations.map((citation) => (
                <li key={citation.id}>
                  <div className="flex items-start pr-4">
                    <div className="shrink-0 pt-1">
                      <input
                        type="checkbox"
                        name={`citationIds`}
                        value={citation.id}
                        className="mr-2 h-5 w-5"
                      />
                    </div>
                    <p>
                      <CitationPrefix
                        citation={citation}
                        orderBy={orderByValue}
                      />
                      {citation.clipped_text}
                      <Link
                        to={`/bank/edit/${citation.id}`}
                        className="ml-2 h-fit whitespace-nowrap"
                        target="_new"
                        asButton
                        appearance="primary"
                        buttonVariant="outline"
                        buttonSize="small"
                      >
                        <EditIcon />
                        Edit in BCE
                      </Link>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <Button type="submit" className="mt-2" appearance="success">
            <SaveIcon /> Link checked quotations
          </Button>
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
    return <em>[No metadata] </em>

  return <strong>{prefixText}: </strong>
}

export const ErrorBoundary = DefaultErrorBoundary
