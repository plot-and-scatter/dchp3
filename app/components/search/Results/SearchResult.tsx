import SearchResults from "~/components/EntryEditor/SearchResults"
import { SecondaryHeader } from "~/components/elements/Headings/SecondaryHeader"
import type { AllSearchResults } from "~/models/search.server"
import { SearchResultEnum } from "~/routes/search/searchResultEnum"

type SearchResultProps = {
  data: {
    searchResults?: AllSearchResults
    searchParams: {
      caseSensitive?: boolean | null
      page: number
      attribute?: string
    }
    url: string
  }
  searchTerm: string
}

export default function SearchResult({ data, searchTerm }: SearchResultProps) {
  if (!data.searchResults) {
    return null
  }

  return (
    <div className="mt-5 w-full border-t-2 border-gray-500 pt-5 lg:w-fit">
      <SecondaryHeader>
        Search results for &ldquo;{searchTerm}
        &rdquo;
        {data.searchParams.caseSensitive !== undefined && (
          <> (case sensitive)</>
        )}
      </SecondaryHeader>
      <div>
        <div className="w-full">
          <SearchResults
            data={data.searchResults}
            text={searchTerm || ""}
            page={data.searchParams.page}
            searchAttribute={
              data.searchParams.attribute || SearchResultEnum.HEADWORD
            }
            url={data.url}
          />
        </div>
      </div>
    </div>
  )
}
