import { useLoaderData } from "@remix-run/react"
import type { LoaderArgs } from "@remix-run/server-runtime"
import { useState } from "react"
import invariant from "tiny-invariant"
import { sourceTypeToText } from "utils/citation"
import BankInput from "~/components/bank/BankInput"
import BankNumericInput from "~/components/bank/BankNumericInput"
import BankTextArea from "~/components/bank/BankTextArea"
import LabelledField from "~/components/bank/LabelledField"
import { PageHeader } from "~/components/elements/PageHeader"
import {
  getAuthorBySourceId,
  getCitationById,
  getPlaceBySourceId,
  getTitleBySourceId,
  getUtteranceBySourceId,
} from "~/models/citation.server"

export const loader = async ({ params }: LoaderArgs) => {
  const citationId = params.citationId
  invariant(citationId, `citationId not found`)

  const citation = await getCitationById(citationId)
  if (!citation) {
    throw new Response(`No citation found with id ${citationId}`, {
      status: 404,
    })
  }

  const sourceId = `${citation.source_id}`

  const { title, place, author, utterance } = await Promise.all([
    getTitleBySourceId(sourceId),
    getPlaceBySourceId(sourceId),
    getAuthorBySourceId(sourceId),
    getUtteranceBySourceId(sourceId),
  ]).then((responses) => {
    return {
      title: responses[0].name,
      place: responses[1].name,
      author: responses[2].name,
      utterance: responses[3],
    }
  })

  return { citation, title, place, author, utterance }
}

export default function EditCitationId() {
  const { citation, title, place, author, utterance } =
    useLoaderData<typeof loader>()

  const [clipStart, setClipStart] = useState(citation.clip_start)
  const [clipEnd, setClipEnd] = useState(citation.clip_end)

  return (
    <>
      <PageHeader>Editing citation</PageHeader>
      <div className="flex gap-x-12">
        <div className="flex w-1/2 flex-col gap-y-4">
          <LabelledField label={`ID`} field={citation.id} />
          <LabelledField
            label={`Headword`}
            field={
              <BankInput name="headword" defaultValue={citation.headword} />
            }
          />
          <LabelledField
            label={`Short Meaning`}
            field={
              <BankTextArea
                name="shortMeaning"
                defaultValue={citation.short_meaning}
              />
            }
          />
          <LabelledField
            label={`Spelling Variant`}
            field={
              <BankInput
                name="spellingVariant"
                defaultValue={citation.spelling_variant}
              />
            }
          />
          <LabelledField label={`POS`} field={citation.part_of_speech} />
          <LabelledField
            label={`Citation`}
            field={
              <BankTextArea
                name="citationText"
                defaultValue={citation.text}
                rows={10}
              />
            }
          />
          <LabelledField
            label={`Clip Indices`}
            field={
              <div className="flex items-center gap-x-4">
                <div>Start:</div>
                <BankNumericInput
                  name="clipIndexStart"
                  defaultValue={citation.clip_start}
                  onChange={(e) => setClipStart(parseInt(e.target.value))}
                />
                <div>End:</div>
                <BankNumericInput
                  name="clipIndexStart"
                  defaultValue={citation.clip_end}
                  onChange={(e) => setClipEnd(parseInt(e.target.value))}
                />
              </div>
            }
          />
          <LabelledField
            label={`Clipped Text`}
            field={
              <code style={{ fontFamily: "Charter, Georgia, serif" }}>
                {citation.text.substring(0, clipStart)}
                <span className="bg-red-300">
                  {citation.text.substring(clipStart, clipEnd)}
                </span>
                {citation.text.substring(clipEnd)}
              </code>
            }
          />
          <LabelledField
            label={`Time Added`}
            field={
              <>
                {citation.created} by {citation.email}
              </>
            }
          />
          <LabelledField
            label={`Last Modified`}
            field={<>{citation.last_modified}</>}
          />
          <LabelledField
            label={`Memo`}
            field={<BankTextArea name={`memo`} defaultValue={citation.memo} />}
          />
          <LabelledField label={`Data Type`} field={citation.type_id} />
          <LabelledField
            label={`Incomplete?`}
            field={citation.is_incomplete ? "true" : "false"}
          />
        </div>
        <div className="flex w-1/2 flex-col gap-y-4">
          <div className="text-lg font-bold">
            {sourceTypeToText(citation.type_id)}
          </div>
          <LabelledField
            label={`Year Pub`}
            field={
              <BankInput name={``} defaultValue={citation.year_published} />
            }
          />
          <LabelledField
            label={`Year Comp`}
            field={
              <BankInput name={``} defaultValue={citation.year_composed} />
            }
          />
          <LabelledField
            label={`Author`}
            field={<BankInput name={``} defaultValue={author} />}
          />
          <LabelledField
            label={`Editor`}
            field={<BankInput name={``} defaultValue={utterance.editor} />}
          />
          <LabelledField
            label={`Title`}
            field={<BankTextArea name={``} defaultValue={title} rows={3} />}
          />
          <LabelledField
            label={`Place`}
            field={<BankInput name={``} defaultValue={place} />}
          />
          <LabelledField
            label={`Publisher`}
            field={<BankInput name={``} defaultValue={utterance.publisher} />}
          />
          <LabelledField
            label={`URL`}
            field={<BankInput name={``} defaultValue={utterance.url} />}
          />
          <LabelledField
            label={`URL Acc. Date`}
            field={
              <BankInput name={``} defaultValue={utterance.url_access_date} />
            }
          />
          <LabelledField
            label={`Page`}
            field={<BankInput name={``} defaultValue={citation.page} />}
          />
        </div>
      </div>
      <div className="mx-auto w-48">
        <button className="rounded border border-blue-500 px-4 py-2 text-blue-500 transition-colors hover:bg-blue-50 hover:text-blue-600">
          Save citation
        </button>
      </div>
    </>
  )
}
