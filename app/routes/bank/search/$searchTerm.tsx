import { PageHeader } from "~/components/elements/PageHeader"
import { useLoaderData } from "@remix-run/react"
import BankSearchResult from "~/components/bank/BankSearchResult"

// We just import and re-export the JSON-based loader.
import { loader } from "~/routes/api/citations/$searchTerm[.json]"
import PaginationControl from "~/components/bank/PaginationControl"
export { loader }

export default function SearchIndex() {
  const {
    searchTerm,
    citations,
    searchOptions,
    pageNumber,
    pageCount,
    citationCount,
    url,
  } = useLoaderData<typeof loader>()

  return (
    <>
      <PageHeader>Search results for {searchTerm}</PageHeader>
      <p className="text-center">
        Page {pageNumber} of {pageCount}, {citationCount} citations total
      </p>
      <PaginationControl
        baseLink={`/bank/search/${searchTerm}`}
        useSearch={"page"}
        url={url}
        currentPage={+pageNumber}
        pageCount={pageCount}
      />
      <hr className="my-4" />
      <div>
        {citations.map((citation) => (
          <BankSearchResult
            citation={citation}
            key={citation.id}
            searchOptions={searchOptions}
          />
        ))}
      </div>{" "}
      <hr className="my-4" />
      <PaginationControl
        baseLink={`/bank/search/${searchTerm}`}
        useSearch={"page"}
        currentPage={+pageNumber}
        pageCount={pageCount}
        url={url}
      />
    </>
  )
}
