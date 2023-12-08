import { SEARCH_PARAMS } from "../../bank/search"
import invariant from "tiny-invariant"
import searchCitations, { PAGE_SIZE } from "~/services/bank/searchCitations"
import type { LoaderArgs } from "@remix-run/server-runtime"
import type { SearchOptions } from "~/services/bank/searchCitations"

export const loader = async ({ request, params }: LoaderArgs) => {
  const { searchTerm, pageNumber } = params
  invariant(searchTerm, `No search term provided`)
  invariant(pageNumber, `No page number provided`)

  const url = new URL(request.url)

  const partialSearchOptions: Omit<SearchOptions, "searchTerm"> =
    SEARCH_PARAMS.reduce((opts, key) => {
      return {
        ...opts,
        [key]: url.searchParams.get(key),
      }
    }, {})

  // const page = partialSearchOptions.page ? +partialSearchOptions.page : 1

  const searchOptions = { ...partialSearchOptions, searchTerm }

  const { count, citations } = await searchCitations(searchOptions)

  return {
    searchTerm,
    citations,
    searchOptions,
    pageNumber,
    pageCount: Math.ceil(count / PAGE_SIZE),
    citationCount: count,
    url,
  }
}

export type CitationSearchLoaderData = Awaited<
  Promise<ReturnType<typeof loader>>
>
