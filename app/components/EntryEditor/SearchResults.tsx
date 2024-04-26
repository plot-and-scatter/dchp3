import { enumValues } from "~/utils/inputUtils"
import {
  SearchResultEnum,
  SearchResultEnumDisplay,
} from "~/routes/search/searchResultEnum"
import { type AllSearchResults } from "~/models/search.server"
import Button from "../elements/LinksAndButtons/Button"
import SearchResultCanadianism from "../search/SearchResultCanadianism"
import SearchResultEntries from "../search/SearchResultEntries"
import SearchResultFistNotes from "../search/SearchResultFistNotes"
import SearchResultMeanings from "../search/SearchResultMeanings"
import SearchResultQuotations from "../search/SearchResultQuotations"
import SearchResultUsageNotes from "../search/SearchResultUsageNotes"
import type JSXNode from "~/types/JSXNode"
import { Link } from "../elements/LinksAndButtons/Link"
import PaginationControl from "../bank/PaginationControl"
import { DEFAULT_PAGE_SIZE } from "~/models/entry.server"

interface SearchResultsProps {
  data: AllSearchResults
  text: string
  page: number
  searchAttribute: string | null
  url: string
}

function getSearchResults(
  page: number,
  text: string,
  data: AllSearchResults,
  attribute: string | null
) {
  switch (data.data.type) {
    case SearchResultEnum.ALL: // By default, show headwords
    case SearchResultEnum.HEADWORD:
      return <SearchResultEntries text={text} data={data.data.entries ?? []} />
    case SearchResultEnum.MEANING:
      return <SearchResultMeanings text={text} data={data.data.entries ?? []} />
    case SearchResultEnum.CANADIANISM:
      return (
        <SearchResultCanadianism text={text} data={data.data.entries ?? []} />
      )
    case SearchResultEnum.USAGE_NOTE:
      return (
        <SearchResultUsageNotes text={text} data={data.data.entries ?? []} />
      )
    case SearchResultEnum.FIST_NOTE:
      return (
        <SearchResultFistNotes text={text} data={data.data.entries ?? []} />
      )
    case SearchResultEnum.QUOTATION:
      return (
        <SearchResultQuotations text={text} data={data.data.entries ?? []} />
      )
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
  page,
  searchAttribute,
  url,
}: SearchResultsProps): JSXNode => {
  return (
    <div className="mx-auto flex w-full flex-col justify-center align-middle lg:w-fit lg:max-w-3xl">
      <div className="mb-2 flex flex-row flex-wrap gap-2 border-gray-700 lg:-mb-[1px] lg:border-b">
        {enumValues(SearchResultEnum)
          .filter((value) => value !== SearchResultEnum.ALL)
          .map((value, index) => (
            <Button
              size="small"
              key={value}
              name="attribute"
              value={value}
              variant={
                searchAttribute === value ||
                (searchAttribute === SearchResultEnum.ALL && index === 0)
                  ? "solid"
                  : "outline"
              }
              className="lg:whitespace-nowrap lg:rounded-bl-none lg:rounded-br-none lg:border-b-0"
            >
              {SearchResultEnumDisplay[value as SearchResultEnum]} (
              {data.counts[value as SearchResultEnum]})
            </Button>
          ))}
      </div>
      <div className="w-full border border-gray-700 bg-gray-50 p-4">
        <div>{getSearchResults(page, text, data, searchAttribute)}</div>
        <PaginationControl
          baseLink={`/search`}
          currentPage={+page}
          pageCount={Math.ceil(
            data.counts[searchAttribute as SearchResultEnum] / DEFAULT_PAGE_SIZE
          )}
          useSearch="page"
          url={url}
        />
      </div>
    </div>
  )
}

export default SearchResults
