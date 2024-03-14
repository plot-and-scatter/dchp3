import { Form } from "@remix-run/react"
import { type MeaningType } from "~/components/Entry/Meanings/Meaning"
import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import Button from "~/components/elements/LinksAndButtons/Button"
import { Link } from "~/components/elements/LinksAndButtons/Link"
import SanitizedTextSpan from "~/components/Entry/Common/SanitizedTextSpan"
import EditIcon from "~/components/elements/Icons/EditIcon"
import DeleteIcon from "~/components/elements/Icons/DeleteIcon"

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
    <div className="flex flex-col gap-y-2">
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
    </div>
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
    <Form method="post">
      <div
        className="flex justify-between gap-x-4 text-base"
        key={meaningId + "-" + citation.id}
      >
        <input
          type="hidden"
          name="entryEditorFormAction"
          value={EntryEditorFormActionEnum.DELETE_QUOTATION}
        />
        <input type="hidden" name="citationId" value={citation.id} />
        <input type="hidden" name="meaningId" value={meaningId} />
        <div>
          <span className="mr-2 font-bold leading-tight text-gray-500">
            {citation.yearcomp || citation.yearpub}
          </span>
          <div className="inline">
            <SanitizedTextSpan text={citation.citation} />
          </div>
          <Link
            to={`/bank/edit/${citation.id}`}
            className="ml-2 h-fit whitespace-nowrap"
            target="_new"
            asButton
            appearance="primary"
            buttonVariant="outline"
            buttonSize="small"
          >
            <EditIcon />
            Edit in BCE
          </Link>
          <Button
            type="submit"
            size="small"
            appearance="danger"
            variant="outline"
            className="ml-2"
            onClick={(e) => {
              if (!confirm("Are you sure you want to unlink this quotation?")) {
                e.preventDefault()
              }
            }}
          >
            <DeleteIcon /> Unlink
          </Button>
        </div>
      </div>
    </Form>
  )
}
