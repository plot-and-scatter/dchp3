import { NavLink } from "@remix-run/react"
import { sourceTypeToText } from "utils/source"
import type { OwnCitationsLoaderData } from "~/routes/bank/own.$pageNumber"
import type { SerializeFrom } from "@remix-run/server-runtime"

interface BankOwnCitationResultProps {
  citation: SerializeFrom<OwnCitationsLoaderData["citations"][0]>
}

export default function BankOwnCitationResult({
  citation,
}: BankOwnCitationResultProps) {
  return (
    <div key={citation.id} className="mb-4">
      <div className="text-lg font-bold">
        <NavLink to={`/bank/edit/${citation.id}`} className="text-blue-500">
          {citation.headword?.headword}
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
        <strong>Citation</strong>:[...] {citation.text} [...] (Source:{" "}
        {sourceTypeToText(citation.source?.type_id)})
      </div>
    </div>
  )
}
