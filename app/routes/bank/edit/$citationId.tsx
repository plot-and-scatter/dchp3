import { PageHeader } from "~/components/elements/PageHeader"
import { Form, useLoaderData } from "@remix-run/react"
import BankHeadwordCitationSelect from "~/components/bank/BankHeadwordCitationSelect"
import BankSourcePanel from "~/components/bank/BankSourcePanels/BankSourcePanel"
import Button from "~/components/elements/Button"
import invariant from "tiny-invariant"
import React from "react"
import {
  json,
  type ActionArgs,
  type LoaderArgs,
  redirect,
} from "@remix-run/server-runtime"
import {
  getAuthorBySourceId,
  getCitationById,
  getCitationsByHeadwordAndUserId,
  getPlaceBySourceId,
  getTitleBySourceId,
  getUtteranceBySourceId as getSourceBySourceId,
  findOrCreateHeadword,
  updateCitation,
  findOrCreateAuthor,
  findOrCreatePlace,
  findOrCreateTitle,
  updateSource,
} from "~/models/bank.server"
import BankEditCitationFields from "~/components/bank/BankEditCitationFields"
import {
  getBooleanFromFormInput,
  getNumberFromFormInput,
  getStringFromFormInput,
  getStringOrNullFromFormInput,
} from "~/utils/generalUtils"
import { getUserIdByEmail } from "~/models/user.server"
import { getEmailFromSession } from "~/services/auth/session.server"
import type { BankCitationUpdate, BankSourceUpdate } from "~/models/bank.types"

export const action = async ({ request, params }: ActionArgs) => {
  const data = Object.fromEntries(await request.formData())
  const headword = getStringFromFormInput(data[`citation.headword`])
  invariant(headword)
  // TODO: Use more invariants + exception catchers

  console.log("data", data)

  const citationId = parseInt(params.citationId || "0")
  invariant(citationId)

  const email = await getEmailFromSession(request)
  if (!email) throw json({ message: `No email on user` }, { status: 500 })
  const userId = await getUserIdByEmail({ email })

  // Find or create the headword
  const headwordId = await findOrCreateHeadword(headword)

  // Update the citation
  const citationFields: BankCitationUpdate = {
    id: citationId,
    memo: getStringFromFormInput(data[`citation.memo`]),
    headword_id: headwordId,
    short_meaning: getStringFromFormInput(data[`citation.short_meaning`]),
    spelling_variant: getStringFromFormInput(data[`citation.spelling_variant`]),
    part_of_speech: getStringFromFormInput(data[`citation.part_of_speech`]),
    text: getStringFromFormInput(data[`citation.text`]),
    clip_start: getNumberFromFormInput(data[`citation.clip_start`]),
    clip_end: getNumberFromFormInput(data[`citation.clip_end`]),
    clipped_text: getStringFromFormInput(data[`citation.clipped_text`]),
    last_modified: new Date(),
    last_modified_user_id: userId,
    legacy_id: getNumberFromFormInput(data[`citation.legacy_id`]),
    is_incomplete: getBooleanFromFormInput(data[`citation.is_incomplete`])
      ? 1
      : 0,
  }

  await updateCitation(citationFields)

  const authorId = await findOrCreateAuthor(
    getStringFromFormInput(data[`author`])
  )
  const placeId = await findOrCreatePlace(getStringFromFormInput(data[`place`]))
  const titleId = await findOrCreateTitle(getStringFromFormInput(data[`title`]))

  const sourceFields: BankSourceUpdate = {
    id: getNumberFromFormInput(data[`source.id`]),
    type_id: getNumberFromFormInput(data[`source.type_id`]),
    year_published: getStringOrNullFromFormInput(data[`source.year_published`]),
    page: getStringOrNullFromFormInput(data[`source.page`]),
    author_id: authorId,
    title_id: titleId,
    place_id: placeId,
    url: getStringOrNullFromFormInput(data[`source.url`]),
    url_access_date: getStringOrNullFromFormInput(
      data[`source.url_access_date`]
    ),
    dateline: getStringOrNullFromFormInput(data[`source.dateline`]),
    periodical_date: getStringOrNullFromFormInput(
      data[`source.periodical_date`]
    ),
    year_composed: getStringOrNullFromFormInput(data[`source.year_composed`]),
    publisher: getStringOrNullFromFormInput(data[`source.publisher`]),
    uttered: getStringOrNullFromFormInput(data[`source.uttered`]),
    utterance_witness: getStringOrNullFromFormInput(
      data[`source.utterance_witness`]
    ),
    utterance_time: getStringOrNullFromFormInput(data[`source.utterance_time`]),
    utterance_media: getStringOrNullFromFormInput(
      data[`source.utterance_media`]
    ),
    utterance_broadcast: getStringOrNullFromFormInput(
      data[`source.utterance_broadcast`]
    ),
    volume_issue: getStringOrNullFromFormInput(data[`source.volume_issue`]),
    editor: getStringOrNullFromFormInput(data[`source.editor`]),
    evidence: getStringOrNullFromFormInput(data[`source.evidence`]),
    is_dchp1: null,
    is_teach: null,
  }

  console.log(sourceFields)

  await updateSource(sourceFields)

  return redirect(`/bank/edit/${citationId}`)
}

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

  const response = await Promise.all([
    getTitleBySourceId(sourceId),
    getPlaceBySourceId(sourceId),
    getAuthorBySourceId(sourceId),
    getSourceBySourceId(sourceId),
    getCitationsByHeadwordAndUserId(citation.headword, citation.user_id),
  ]).then((responses) => {
    return {
      title: responses[0]?.name,
      place: responses[1]?.name,
      author: responses[2]?.name,
      source: responses[3],
      headwordCitations: responses[4],
    }
  })

  return { citation, ...response }
}

export type EditCitationIdLoaderData = Awaited<
  Promise<ReturnType<typeof loader>>
>

export default function EditCitationId() {
  const data = useLoaderData<typeof loader>()

  const { citation, headwordCitations } = data

  return (
    <React.Fragment>
      <PageHeader>Editing citation</PageHeader>
      <BankHeadwordCitationSelect
        citations={headwordCitations}
        currentCitationId={citation.id}
        currentEmail={citation.email}
      />
      <hr className="my-6" />
      <Form action={`/bank/edit/${citation.id}`} method={`post`}>
        <div className="flex gap-x-12">
          <div className="flex w-1/2 flex-col gap-y-4">
            <BankEditCitationFields {...data} key={citation.id} />
          </div>
          <div className="flex w-1/2 flex-col gap-y-4">
            <BankSourcePanel {...data} key={citation.id} />
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
      </Form>
    </React.Fragment>
  )
}
