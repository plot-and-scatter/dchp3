import { PageHeader } from "~/components/elements/PageHeader"
import { useLoaderData } from "@remix-run/react"
// import BankCitationResult from "~/components/bank/BankCitationResult"
import invariant from "tiny-invariant"
import type { SearchOptions } from "~/services/bank/searchCitations"
import searchCitations from "~/services/bank/searchCitations"
import type { LoaderArgs } from "@remix-run/server-runtime"
import BankCitationResultAlt from "~/components/bank/BankCitationResultAlt"
import { SEARCH_PARAMS } from "."

export const loader = async ({ request, params }: LoaderArgs) => {
  const { searchTerm } = params
  invariant(searchTerm, `No search term provided`)

  const url = new URL(request.url)

  const searchOptions: Omit<SearchOptions, "searchTerm"> = SEARCH_PARAMS.reduce(
    (opts, key) => {
      return {
        ...opts,
        [key]: url.searchParams.get(key),
      }
    },
    {}
  )

  const citations = await searchCitations({
    ...searchOptions,
    searchTerm,
  })

  return { searchTerm, citations }
}

export default function SearchIndex() {
  const { searchTerm, citations } = useLoaderData<typeof loader>()

  return (
    <>
      <PageHeader>Search results for {searchTerm}</PageHeader>
      {citations.map((citation) => (
        // <BankCitationResult citation={citation} key={citation.id} />
        <BankCitationResultAlt citation={citation} key={citation.id} />
      ))}
    </>
  )
}
