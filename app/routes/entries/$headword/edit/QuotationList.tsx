import { Form } from "@remix-run/react"
import { type MeaningType } from "~/components/Meaning"
import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import Button from "~/components/elements/LinksAndButtons/Button"
import { Link } from "~/components/elements/LinksAndButtons/Link"

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
  if (!citation) return <></>

  return (
    <div
      className="flex justify-between gap-x-4"
      key={meaningId + "-" + citation.id}
    >
      <p>
        <strong> {citation.yearcomp || citation.yearpub}:</strong>{" "}
        {citation.citation}
      </p>
      <div className="flex gap-x-2">
        <Link
          asButton
          buttonSize="small"
          to={`/bank/edit/${citation.id}`}
          className="h-fit"
        >
          Edit
        </Link>
        <Form method="post">
          <input
            type="hidden"
            name="attributeType"
            value={EntryEditorFormActionEnum.DELETE_QUOTATION}
          />
          <input type="hidden" name="quotationId" value={citation.id} />
          <input type="hidden" name="meaningId" value={meaningId} />
          <Button type="submit" size="small" appearance="danger">
            Remove
          </Button>
        </Form>
      </div>
    </div>
  )
}
