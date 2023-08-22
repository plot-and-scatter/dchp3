import type {
  BankCitation,
  BankHeadword,
  BankPlace,
  BankSource,
} from "@prisma/client"
import { NavLink } from "@remix-run/react"
import { sourceTypeToText } from "utils/source"

export type BankCitationResultType = {
  id: BankCitation["id"]
  text: BankCitation["text"]
  short_meaning: BankCitation["short_meaning"]
  spelling_variant: BankCitation["spelling_variant"]
  headword: BankHeadword["headword"]
  type_id: BankSource["type_id"]
  year_composed: BankSource["year_composed"]
  year_published: BankSource["year_published"]
  place_name: BankPlace["name"]
}

interface BankCitationResultProps {
  citation: BankCitationResultType
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
