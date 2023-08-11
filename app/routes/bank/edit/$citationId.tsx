import { useLoaderData } from "@remix-run/react"
import type { LoaderArgs } from "@remix-run/server-runtime"
import invariant from "tiny-invariant"
import BankInput from "~/components/bank/BankInput"
import BankTextArea from "~/components/bank/BankTextArea"
import LabelledField from "~/components/bank/LabelledField"
import { PageHeader } from "~/components/elements/PageHeader"
import { getCitationById } from "~/models/citation.server"

export const loader = async ({ params }: LoaderArgs) => {
  const citationId = params.citationId
  invariant(citationId, `citationId not found`)

  const citation = await getCitationById(citationId).then(
    (response) => response[0] // Get first item
  )
  if (!citation) {
    throw new Response(`No citation found with id ${citationId}`, {
      status: 404,
    })
  }

  return citation
}

export default function EditCitationId() {
  const citation = useLoaderData<typeof loader>()

  console.log("citation", citation)

  return (
    <>
      <PageHeader>Editing citation</PageHeader>
      <div className="flex w-1/2 flex-col gap-y-4">
        <LabelledField label={`ID`} field={citation.id} />
        <LabelledField
          label={`Headword`}
          field={<BankInput name="headword" defaultValue={citation.headword} />}
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
              <BankInput
                name="clipIndexStart"
                defaultValue={citation.clip_start}
              />
              <div>End:</div>
              <BankInput
                name="clipIndexStart"
                defaultValue={citation.clip_end}
              />
            </div>
          }
        />
        <LabelledField
          label={`Clipped Text`}
          field={
            <BankTextArea
              className="text-red-700"
              name="citationText"
              defaultValue={citation.text.substring(
                citation.clip_start,
                citation.clip_end
              )}
              rows={10}
            />
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
    </>
  )
}
