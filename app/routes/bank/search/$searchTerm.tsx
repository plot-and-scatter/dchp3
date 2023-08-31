import { PageHeader } from "~/components/elements/PageHeader"
import { SEARCH_PARAMS } from "."
import { useLoaderData } from "@remix-run/react"
import BankSearchResult from "~/components/bank/BankSearchResult"
import invariant from "tiny-invariant"
import searchCitations from "~/services/bank/searchCitations"
import type { LoaderArgs } from "@remix-run/server-runtime"
import type { SearchOptions } from "~/services/bank/searchCitations"

export const loader = async ({ request, params }: LoaderArgs) => {
  const { searchTerm } = params
  invariant(searchTerm, `No search term provided`)

  const url = new URL(request.url)

  const partialSearchOptions: Omit<SearchOptions, "searchTerm"> =
    SEARCH_PARAMS.reduce((opts, key) => {
      return {
        ...opts,
        [key]: url.searchParams.get(key),
      }
    }, {})

  const searchOptions = { ...partialSearchOptions, searchTerm }

  const citations = await searchCitations(searchOptions)

  return { searchTerm, citations, searchOptions }
}

export type CitationSearchLoaderData = Awaited<
  Promise<ReturnType<typeof loader>>
>

export default function SearchIndex() {
  const { searchTerm, citations, searchOptions } =
    useLoaderData<typeof loader>()

  return (
    <>
      <PageHeader>Search results for {searchTerm} (temp limit 100)</PageHeader>
      {citations.map((citation) => (
        // <BankCitationResult citation={citation} key={citation.id} />
        <BankSearchResult
          citation={citation}
          key={citation.id}
          searchOptions={searchOptions}
        />
      ))}
    </>
  )
}
