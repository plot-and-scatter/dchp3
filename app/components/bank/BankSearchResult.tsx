import { NavLink } from "@remix-run/react"
import type { SerializeFrom } from "@remix-run/server-runtime"
import { sourceTypeToText } from "utils/source"
import type { CitationSearchLoaderData } from "~/routes/bank/search/$searchTerm"
import type { SearchOptions } from "~/services/bank/searchCitations"
import Highlighter from "react-highlight-words"

interface BankSearchResultProps {
  citation: SerializeFrom<CitationSearchLoaderData["citations"][0]>
  searchOptions: SearchOptions
}

export default function BankSearchResult({
  citation,
  searchOptions,
}: BankSearchResultProps) {
  const { searchTerm } = searchOptions

  const headwordText =
    searchOptions.searchField === "headword" ? (
      <Highlighter
        highlightClassName="font-bold text-red-500 font-italic bg-transparent"
        searchWords={[searchTerm]}
        textToHighlight={citation.headword?.headword || ""}
      />
    ) : (
      citation.headword?.headword
    )

  const citationTextInWords: string[] = (citation.text || "").split(" ")

  const searchTextIndices = []
  let workingCopy = [...citationTextInWords]

  let previousIndex = -1

  do {
    const index = workingCopy.findIndex(
      (text, index) =>
        text.toLowerCase().includes(searchTerm) && index > previousIndex
    )
    previousIndex = index
    if (index > -1) searchTextIndices.push(index)
  } while (previousIndex > -1)

  console.log("searchTextIndices", searchTextIndices)

  const citationText =
    searchOptions.searchField === "citation" ? (
      <Highlighter
        highlightClassName="font-bold text-red-500 font-italic bg-transparent"
        searchWords={[searchTerm]}
        textToHighlight={citation.text || ""}
      />
    ) : (
      citation.text
    )

  return (
    <div key={citation.id} className="mb-4">
      <div className="text-lg font-bold">
        <NavLink to={`/bank/edit/${citation.id}`} className="text-blue-500">
          {headwordText}
        </NavLink>
      </div>
      <div>
        <strong>Meaning Short</strong>: {citation.short_meaning}
        <br />
        <strong>ID</strong>: {citation.id} | <strong>Year Pub</strong>:{" "}
        {citation.source?.year_published} | <strong>Year</strong>
        <strong>Comp</strong>: {citation.source?.year_composed} |{" "}
        <strong>Place</strong>: {citation.source?.place?.name} |
        <strong>Spelling Variations</strong>: {citation.spelling_variant}
        <br />
        <strong>Citation</strong>: {citationText} (Source:{" "}
        {sourceTypeToText(citation.source?.type_id)})
      </div>
    </div>
  )
}
