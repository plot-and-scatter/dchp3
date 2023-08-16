import { useLoaderData } from "@remix-run/react"
import type { LoaderArgs } from "@remix-run/server-runtime"
import { useState } from "react"
import invariant from "tiny-invariant"
import BankInput from "~/components/bank/BankInput"
import BankNumericInput from "~/components/bank/BankNumericInput"
import BankRadio from "~/components/bank/BankRadio"
import BankSelect from "~/components/bank/BankSelect"
import BankSourcePanel from "~/components/bank/BankSourcePanels/BankSourcePanel"
import BankTextArea from "~/components/bank/BankTextArea"
import LabelledField from "~/components/bank/LabelledField"
import Button from "~/components/elements/Button"
import { PageHeader } from "~/components/elements/PageHeader"
import {
  getAuthorBySourceId,
  getCitationById,
  getPlaceBySourceId,
  getTitleBySourceId,
  getUtteranceBySourceId,
} from "~/models/bank.server"
import { LegacyTypeEnum } from "~/models/bank.types"
import { enumToSelectOptions } from "~/utils/inputUtils"

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
  const data = useLoaderData<typeof loader>()

  const { citation } = data

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
              // TODO: Put this elsewhere. We are using the <code> tag because
              // the smartquotes feature does not apply to it.
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
          <LabelledField
            label={`Data Type`}
            field={
              <BankSelect
                name={`legacy_id`}
                defaultValue={citation.legacy_id}
                options={enumToSelectOptions(LegacyTypeEnum)}
              />
            }
          />
          <LabelledField
            label={`Incomplete?`}
            field={
              <BankRadio
                className={`flex gap-x-4`}
                optionSetClassName={`flex gap-x-2`}
                name={`incomplete`}
                options={[
                  { name: `Yes`, value: `true` },
                  { name: `No`, value: `false` },
                ]}
                defaultValue={citation.is_incomplete ? "true" : "false"}
              />
            }
          />
        </div>
        <div className="flex w-1/2 flex-col gap-y-4">
          <BankSourcePanel {...data} />
          <div className="mx-auto mt-12 flex items-center gap-x-12">
            <div>
              <Button appearance="success" size="large">
                <i className="fa-solid fa-download mr-2" /> Save citation
              </Button>
            </div>
            <div>
              <Button appearance="danger">
                <i className="fa-solid fa-xmark mr-2" /> Delete citation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
