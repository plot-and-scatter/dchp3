import { Form, Link } from "@remix-run/react"
import { type MeaningType } from "~/components/Meaning"
import { attributeEnum } from "~/components/editing/attributeEnum"

export type CitationType = MeaningType["citations"][0]

interface QuotationListProps {
  citations: CitationType[]
  meaningId: number
}

export default function QuotationList({
  citations,
  meaningId,
}: QuotationListProps) {
  return (
    <>
      {citations
        .map((c) => c.citation)
        .sort((a, b) => {
          if (!a || !b) return 0
          const aYearComp = a.yearcomp ? a.yearcomp.split("-")[0] : ""
          const bYearComp = b.yearcomp ? b.yearcomp.split("-")[0] : ""
          const aYearPub = a.yearpub ? a.yearpub.split("-")[0] : ""
          const bYearPub = b.yearpub ? b.yearpub.split("-")[0] : ""
          return (
            parseInt(aYearComp || aYearPub) - parseInt(bYearComp || bYearPub)
          )
        })
        .map((c) => {
          return <CitationItem key={c?.id} meaningId={meaningId} citation={c} />
        })}
    </>
  )
}

type Citation = CitationType["citation"]

interface CitationItemProps {
  key: number | undefined
  meaningId: number
  citation: Citation
}

function CitationItem({ citation, meaningId }: CitationItemProps) {
  if (!citation) return <></> //TODO return something else

  return (
    <div className="my-2 grid grid-cols-12" key={citation.id}>
      <p className="col-span-10">
        <strong> {citation.yearcomp || citation.yearpub}:</strong>{" "}
        {citation.citation}
      </p>
      <Link to={`/bank/edit/${citation.id}`}>Edit </Link>
      <Form method="post">
        <input
          type="hidden"
          name="attributeType"
          value={attributeEnum.DELETE_QUOTATION}
        />
        <input type="hidden" name="quotationId" value={citation.id} />
        <input type="hidden" name="meaningId" value={meaningId} />
        <button type="submit">Remove</button>
      </Form>
    </div>
  )
}
