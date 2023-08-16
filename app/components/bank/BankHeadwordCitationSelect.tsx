import type { CitationsByHeadwordAndUserIdType } from "~/models/bank.types"
import BankSelect from "./BankSelect"
import { useNavigate } from "@remix-run/react"

interface BankHeadwordCitationSelectProps {
  citations: CitationsByHeadwordAndUserIdType[]
  currentCitationId: number
  currentEmail: string
}

export default function BankHeadwordCitationSelect({
  citations,
  currentCitationId,
  currentEmail,
}: BankHeadwordCitationSelectProps) {
  const navigate = useNavigate()

  return (
    <div>
      {/* TODO: Improve the appearance of this. */}
      <BankSelect
        name={`headword`}
        defaultValue={currentCitationId}
        options={citations.map((c) => ({
          value: c.id,
          name: `${c.headword} (${c.id}): ${c.name}, ${c.year_published}`,
        }))}
        onChange={(event) => navigate(`/bank/edit/${event.target.value}`)}
      />
      <span className="ml-2">entered by {currentEmail}</span>
    </div>
  )
}
