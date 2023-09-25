import React from "react"
import type JSXNode from "~/types/JSXNode"
import { SearchResultEnum } from "~/routes/search/searchResultEnum"
import SearchResultEntries from "./search/SearchResultEntries"
import SearchResultMeanings from "./search/SearchResultMeanings"
import SearchResultUsageNotes from "./search/SearchResultUsageNotes"
import SearchResultCanadianism from "./search/SearchResultCanadianism"
import SearchResultFistNotes from "./search/SearchResultFistNotes"
import SearchResultQuotations from "./search/SearchResultQuotations"

interface SearchResultsProps {
  data: any[]
  text: string
  pageNumber: string | undefined
  searchAttribute: string | null
}

function getSearchResults(
  pageNumber: string,
  text: string,
  data: any[],
  attribute: string | null
) {
  switch (attribute) {
    case SearchResultEnum.HEADWORD:
      return <SearchResultEntries text={text} data={data} />
    case SearchResultEnum.MEANING:
      return <SearchResultMeanings text={text} data={data} />
    case SearchResultEnum.CANADIANISM:
      return <SearchResultCanadianism text={text} data={data} />
    case SearchResultEnum.USAGE_NOTE:
      return <SearchResultUsageNotes text={text} data={data} />
    case SearchResultEnum.FIST_NOTE:
      return <SearchResultFistNotes text={text} data={data} />
    case SearchResultEnum.QUOTATION:
      return <SearchResultQuotations text={text} data={data} />
    default:
      throw new Response(null, {
        status: 400,
        statusText: `Text length must be greater than zero`,
      })
  }
}

const SearchResults = ({
  data,
  text,
  pageNumber,
  searchAttribute,
}: SearchResultsProps): JSXNode => {
  const page = pageNumber ? pageNumber : "1"

  return (
    <div className="mt-3 flex max-w-3xl flex-col justify-center align-middle">
      {getSearchResults(page, text, data, searchAttribute)}
    </div>
  )
}

export default SearchResults
