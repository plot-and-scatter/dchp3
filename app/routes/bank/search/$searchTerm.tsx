import { PageHeader } from "~/components/elements/PageHeader"
import { useLoaderData } from "@remix-run/react"
import BankSearchResult from "~/components/bank/BankSearchResult"

// We just import and re-export the JSON-based loader.
import { loader } from "~/routes/api/citations/$searchTerm[.json]"
export { loader }

export default function SearchIndex() {
  const { searchTerm, citations, searchOptions } =
    useLoaderData<typeof loader>()

  return (
    <>
      <PageHeader>Search results for {searchTerm} (temp limit 100)</PageHeader>
      {citations.map((citation) => (
        <BankSearchResult
          citation={citation}
          key={citation.id}
          searchOptions={searchOptions}
        />
      ))}
    </>
  )
}
