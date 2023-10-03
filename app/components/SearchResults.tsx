import React from "react"
import type JSXNode from "~/types/JSXNode"
import { SearchResultEnum } from "~/routes/search/searchResultEnum"
import SearchResultEntries from "./search/SearchResultEntries"
import SearchResultMeanings from "./search/SearchResultMeanings"
import SearchResultUsageNotes from "./search/SearchResultUsageNotes"
import SearchResultCanadianism from "./search/SearchResultCanadianism"
import SearchResultFistNotes from "./search/SearchResultFistNotes"
import SearchResultQuotations from "./search/SearchResultQuotations"
import { type AllSearchResults } from "~/models/search.server"

interface SearchResultsProps {
  data: AllSearchResults
  text: string
  pageNumber: string | undefined
  searchAttribute: string | null
}

function getSearchResults(
  pageNumber: string,
  text: string,
  data: AllSearchResults,
  attribute: string | null
) {
  switch (attribute) {
    case SearchResultEnum.ALL:
      return (
        <>
          <SearchResultEntries text={text} data={data.Headwords ?? []} />
          <SearchResultMeanings text={text} data={data.Meanings ?? []} />
          <SearchResultCanadianism text={text} data={data.Canadianisms ?? []} />
          <SearchResultUsageNotes text={text} data={data.UsageNotes ?? []} />
          <SearchResultFistNotes text={text} data={data.FistNotes ?? []} />
          <SearchResultQuotations text={text} data={data.Quotations ?? []} />
        </>
      )
    case SearchResultEnum.HEADWORD:
      return <SearchResultEntries text={text} data={data.Headwords ?? []} />
    case SearchResultEnum.MEANING:
      return <SearchResultMeanings text={text} data={data.Meanings ?? []} />
    case SearchResultEnum.CANADIANISM:
      return (
        <SearchResultCanadianism text={text} data={data.Canadianisms ?? []} />
      )
    case SearchResultEnum.USAGE_NOTE:
      return <SearchResultUsageNotes text={text} data={data.UsageNotes ?? []} />
    case SearchResultEnum.FIST_NOTE:
      return <SearchResultFistNotes text={text} data={data.FistNotes ?? []} />
    case SearchResultEnum.QUOTATION:
      return <SearchResultQuotations text={text} data={data.Quotations ?? []} />
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
      <h2 className="my-5 mb-10 text-4xl font-extrabold">
        Page {page} results for: "{text}"
      </h2>
      {getSearchResults(page, text, data, searchAttribute)}
    </div>
  )
}

export default SearchResults
