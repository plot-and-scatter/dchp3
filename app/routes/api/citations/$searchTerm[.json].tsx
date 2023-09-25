import { SEARCH_PARAMS } from "../../bank/search"
import invariant from "tiny-invariant"
import searchCitations from "~/services/bank/searchCitations"
import type { LoaderArgs } from "@remix-run/server-runtime"
import type { SearchOptions } from "~/services/bank/searchCitations"

export const loader = async ({ request, params }: LoaderArgs) => {
  const { searchTerm } = params
  invariant(searchTerm, `No search term provided`)

  const url = new URL(request.url)
  console.log("REQUESTED URL")
  console.log(url.toString())

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
