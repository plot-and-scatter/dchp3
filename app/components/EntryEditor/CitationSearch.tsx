import { resetFetcher } from "~/routes/api/reset-fetcher"
import { useFetcher } from "@remix-run/react"
import Input from "../bank/Input"
import type { CitationSearchLoaderData } from "~/routes/api/citations/$searchTerm[.json]"
import RadioOrCheckbox from "../bank/RadioOrCheckbox"
import Button from "../elements/LinksAndButtons/Button"
import LabelledField from "../bank/LabelledField"
import { Link } from "../elements/LinksAndButtons/Link"

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

// const DEBOUNCE_DELAY_IN_MS = 200

export default function CitationSearch() {
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
    <div className="w-1/2">
      <form onSubmit={onSubmit}>
        <div className="flex">
          <div className="w-full">
            <Input
              placeholder="Enter text to search citations by headword"
              name="searchText"
              // onChange={onChangeAction}
            />
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
        <div>
          <strong>
            {citations.data.citations.length} citations (temp max 100)
          </strong>
          <ul>
            {citations.data.citations.map((citation) => (
              <li key={citation.id} className="flex">
                <RadioOrCheckbox
                  type="checkbox"
                  name="citationId"
                  options={[{ label: "", value: String(citation.id) }]}
                  className="mr-2"
                />
                <div>
                  <strong>[ID: {citation.id}]</strong> {citation.clipped_text}{" "}
                  <Link
                    to={`/bank/edit/${citation.id}`}
                    className="font-variant"
                  >
                    Edit
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
