import React from "react"
import type JSXNode from "~/types/JSXNode"
import { SearchResultEnum } from "~/routes/search/searchResultEnum"
import SearchResultEntries from "./search/SearchResultEntries"
import SearchResultMeanings from "./search/SearchResultMeanings"

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
    default:
      throw new Error(`attribute ${attribute} is invalid`)
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
