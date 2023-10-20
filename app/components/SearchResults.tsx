import React from "react"
import type JSXNode from "~/types/JSXNode"
import {
  SearchResultEnum,
  SearchResultEnumDisplay,
} from "~/routes/search/searchResultEnum"
import SearchResultEntries from "./search/SearchResultEntries"
import SearchResultMeanings from "./search/SearchResultMeanings"
import SearchResultUsageNotes from "./search/SearchResultUsageNotes"
import SearchResultCanadianism from "./search/SearchResultCanadianism"
import SearchResultFistNotes from "./search/SearchResultFistNotes"
import SearchResultQuotations from "./search/SearchResultQuotations"
import { type AllSearchResults } from "~/models/search.server"
import { enumValues } from "~/utils/inputUtils"
import Button from "./elements/LinksAndButtons/Button"

interface SearchResultsProps {
  data: AllSearchResults
  text: string
  pageNumber: string | null
  searchAttribute: string | null
}

function getSearchResults(
  pageNumber: string,
  text: string,
  data: AllSearchResults,
  attribute: string | null
) {
  switch (attribute) {
    case SearchResultEnum.ALL: // By default, show headwords
    case SearchResultEnum.HEADWORD:
      return <SearchResultEntries text={text} data={data.Headword ?? []} />
    case SearchResultEnum.MEANING:
      return <SearchResultMeanings text={text} data={data.Meaning ?? []} />
    case SearchResultEnum.CANADIANISM:
      return (
        <SearchResultCanadianism text={text} data={data.Canadianism ?? []} />
      )
    case SearchResultEnum.USAGE_NOTE:
      return <SearchResultUsageNotes text={text} data={data.UsageNote ?? []} />
    case SearchResultEnum.FIST_NOTE:
      return <SearchResultFistNotes text={text} data={data.FistNote ?? []} />
    case SearchResultEnum.QUOTATION:
      return <SearchResultQuotations text={text} data={data.Quotation ?? []} />
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
  const page = pageNumber ?? "1"

  return (
    <div className="-m-4 flex max-w-3xl flex-col justify-center p-4 align-middle">
      <div className="-mb-[1px] flex flex-row gap-x-2 border-b border-slate-700">
        {enumValues(SearchResultEnum)
          .filter((value) => value !== SearchResultEnum.ALL)
          .map((value, index) => (
            <Button
              size="small"
              key={value}
              name={"attribute"}
              value={value}
              variant={
                searchAttribute === value ||
                (searchAttribute === SearchResultEnum.ALL && index === 0)
                  ? "solid"
                  : "outline"
              }
              className="whitespace-nowrap rounded-bl-none rounded-br-none border-b-0"
            >
              {SearchResultEnumDisplay[value as SearchResultEnum]} (
              {data[value as keyof AllSearchResults]?.length})
            </Button>
          ))}
      </div>
      {/* <h2 className="my-5 mb-10 text-4xl font-extrabold">
        Page {page} results for: "{text}"
      </h2> */}
      <div className="border border-slate-700 bg-slate-50 p-4">
        <div>{getSearchResults(page, text, data, searchAttribute)}</div>
        {/* <div className="flex justify-between gap-x-2 pt-4 text-center">
          <Button type="submit" size="small" name="nextPage" value="false">
            &larr; Previous page
          </Button>
          <Button type="submit" size="small" name="nextPage" value="true">
            Next page &rarr;
          </Button>
        </div> */}
      </div>
    </div>
  )
}

export default SearchResults
