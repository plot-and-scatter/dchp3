import { useNavigate } from "@remix-run/react"
import Select from "./Select"
import type { EditCitationIdLoaderData } from "~/routes/bank/edit/$citationId"
import type { SerializeFrom } from "@remix-run/server-runtime"

interface BankHeadwordCitationSelectProps {
  citations: SerializeFrom<EditCitationIdLoaderData["headwordCitations"][0]>[]
  currentCitation: SerializeFrom<EditCitationIdLoaderData["citation"]>
}

export default function BankHeadwordCitationSelect({
  citations,
  currentCitation,
}: BankHeadwordCitationSelectProps) {
  const navigate = useNavigate()

  return (
    <div>
      {/* TODO: Improve the appearance of this. */}
      <Select
        name={`headword--citation-select`}
        defaultValue={currentCitation.id}
        options={citations.map((c) => ({
          value: String(c.id),
          label: `${c.headword?.headword} (${c.id}): ${
            c.source?.place?.name || "[Place not entered]"
          }, ${c.source?.year_published || "[Publishing year not entered]"}`,
        }))}
        onChange={(event) => navigate(`/bank/edit/${event.target.value}`)}
      />
      <span className="ml-2">
        entered by{" "}
        {currentCitation.creator?.email || "[Creator email not available]"}
      </span>
    </div>
  )
}
