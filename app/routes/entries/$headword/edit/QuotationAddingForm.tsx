import { resetFetcher } from "~/routes/api/reset-fetcher"
import { Form, useFetcher } from "@remix-run/react"
import type { CitationSearchLoaderData } from "~/routes/api/citations/$searchTerm[.json]"
import BankInput from "~/components/bank/BankInput"
import LabelledField from "~/components/bank/LabelledField"
import BankRadioOrCheckbox from "~/components/bank/BankRadioOrCheckbox"
import Button from "~/components/elements/Button"
import { attributeEnum } from "~/components/editing/attributeEnum"

interface QuotationAddingFormProps {
  meaningId: number
}

const citationSearchUrl = (
  searchTerm: string,
  { orderBy, orderDirection }: { orderBy?: string; orderDirection?: string }
) => {
  const url = `/api/citations/${searchTerm}.json`

  const searchParams = new URLSearchParams()
  searchParams.set("searchField", "headword")
  if (orderBy) searchParams.set("orderBy", orderBy)
  if (orderDirection) searchParams.set("orderDirection", orderDirection)

  return `${url}?${searchParams.toString()}`
}

export default function QuotationAddingForm({
  meaningId,
}: QuotationAddingFormProps) {
  const citations = useFetcher<CitationSearchLoaderData>()

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event: any
  ) => {
    event.preventDefault()

    const searchText = event.target.elements.searchText.value
    const orderBy = event.target.elements.orderBy.value
    const orderDirection = event.target.elements.orderDirection.value

    if (searchText.length >= 0) {
      // await resetFetcher(citations)
      citations.load(citationSearchUrl(searchText, { orderBy, orderDirection }))
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
          </div>
          <div className="w-24">
            {citations.state === "loading" && <div>Loading...</div>}
          </div>
        </div>
        <Button appearance="primary" type="submit" className="mt-2">
          Search
        </Button>
      </form>
      {citations.data && (
        <Form method="post">
          <strong>
            {citations.data.citations.length} citations (temp max 100)
          </strong>
          <Button type="submit">Add Quotations</Button>
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
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name={`citationId-${citation.id}`}
                      value={citation.id}
                      className="mx-1 p-1"
                    />
                    <p>
                      <strong>{citation.id}: </strong> {citation.clipped_text}{" "}
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
