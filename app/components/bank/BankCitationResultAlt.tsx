import type { SerializeFrom } from "@remix-run/server-runtime"

import type {
  BankCitation,
  BankHeadword,
  BankPlace,
  BankSource,
} from "@prisma/client"
import { NavLink } from "@remix-run/react"
import { sourceTypeToText } from "utils/source"
import type { OwnCitationsLoaderData } from "~/routes/bank/own"

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
  // citation: SerializeFrom<OwnCitationsLoaderData["myCitations"][0]>
  citation: any
}

export default function BankCitationResultAlt({
  citation,
}: BankCitationResultProps) {
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
        <strong>Citation</strong>:[...] {citation.text} [..] (Source:{" "}
        {sourceTypeToText(citation.source?.type_id)})
      </div>
    </div>
  )
}
