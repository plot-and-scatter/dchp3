import { NavLink } from "@remix-run/react"
import { sourceTypeToText } from "utils/source"
import type { BankGetOwnCitation } from "~/models/bank.types"

interface BankCitationResultProps {
  citation: BankGetOwnCitation
}

export default function BankCitationResult({
  citation,
}: BankCitationResultProps) {
  return (
    <div key={citation.id} className="mb-4">
      <div className="text-lg font-bold">
        <NavLink to={`/bank/edit/${citation.id}`} className="text-blue-500">
          {citation.headword}
        </NavLink>
      </div>
      <div>
        <strong>Meaning Short</strong>: {citation.short_meaning}
        <br />
        <strong>ID</strong>: {citation.id} | <strong>Year Pub</strong>:{" "}
        {citation.year_published} | <strong>Year</strong>
        <strong>Comp</strong>: {citation.year_composed} | <strong>Place</strong>
        : {citation.place_name} |<strong>Spelling Variations</strong>:{" "}
        {citation.spelling_variant}
        <br />
        <strong>Citation</strong>:[...] {citation.text} [..] (Source:{" "}
        {sourceTypeToText(citation.type_id)})
      </div>
    </div>
  )
}
