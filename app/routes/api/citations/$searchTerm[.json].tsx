import { SEARCH_PARAMS } from "../../bank/search"
import invariant from "tiny-invariant"
import searchCitations, { PAGE_SIZE } from "~/services/bank/searchCitations"
import type { LoaderFunctionArgs } from "react-router"
import type { SearchOptions } from "~/services/bank/searchCitations"

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
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

  // const page = partialSearchOptions.page ? +partialSearchOptions.page : 1

  const searchOptions = { ...partialSearchOptions, searchTerm }

  const { count, citations, page } = await searchCitations(searchOptions)

  return {
    searchTerm,
    citations,
    searchOptions,
    pageNumber: page,
    pageCount: Math.ceil(count / PAGE_SIZE),
    citationCount: count,
    // Serialized here rather than passed as a URL: single fetch streams values
    // with turbo-stream, which has no URL representation, and the only
    // consumer (PaginationControl) wants the string anyway.
    url: url.toString(),
  }
}

export type CitationSearchLoaderData = Awaited<
  Promise<ReturnType<typeof loader>>
>
