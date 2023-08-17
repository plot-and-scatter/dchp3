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
  createCitation,
  createSource,
} from "~/models/bank.server"
import BankEditCitationFields from "~/components/bank/BankEditCitationFields"
import {
  getBooleanFromFormInput,
  getNumberFromFormInput,
  getStringFromFormInput,
  getStringOrNullFromFormInput,
} from "~/utils/generalUtils"
import type { BankCitation } from "@prisma/client"
import { getUserIdByEmail } from "~/models/user.server"
import { getEmailFromSession } from "~/services/auth/session.server"
import type {
  BankCitationCreate,
  BankCitationUpdate,
  BankSourceCreate,
  BankSourceUpdate,
} from "~/models/bank.types"

export const action = async ({ request, params }: ActionArgs) => {
  const data = Object.fromEntries(await request.formData())
  const headword = getStringFromFormInput(data[`citation.headword`])
  invariant(headword)
  // TODO: Use more invariants + exception catchers

  console.log("data", data)

  const email = await getEmailFromSession(request)
  if (!email) throw json({ message: `No email on user` }, { status: 500 })
  const userId = await getUserIdByEmail({ email })

  // Find or create the headword
  const headwordId = await findOrCreateHeadword(headword)

  const authorId = await findOrCreateAuthor(
    getStringFromFormInput(data[`author`])
  )
  const placeId = await findOrCreatePlace(getStringFromFormInput(data[`place`]))
  const titleId = await findOrCreateTitle(getStringFromFormInput(data[`title`]))

  const sourceFields: BankSourceCreate = {
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

  const source = await createSource(sourceFields)

  // Create the citation
  const citationFields: BankCitationCreate = {
    source_id: source.id,
    memo: getStringFromFormInput(data[`citation.memo`]),
    headword_id: headwordId,
    short_meaning: getStringFromFormInput(data[`citation.short_meaning`]),
    spelling_variant: getStringFromFormInput(data[`citation.spelling_variant`]),
    part_of_speech: getStringFromFormInput(data[`citation.part_of_speech`]),
    text: getStringFromFormInput(data[`citation.text`]),
    clip_start: getNumberFromFormInput(data[`citation.clip_start`]),
    clip_end: getNumberFromFormInput(data[`citation.clip_end`]),
    clipped_text: getStringFromFormInput(data[`citation.clipped_text`]),
    created: new Date(),
    user_id: userId,
    legacy_id: getNumberFromFormInput(data[`citation.legacy_id`]),
    is_incomplete: getBooleanFromFormInput(data[`citation.is_incomplete`])
      ? 1
      : 0,
    is_dchp1: null,
    is_teach: null,
  }
  const citation = await createCitation(citationFields)

  return redirect(`/bank/edit/${citation.id}`)
}

export const loader = async ({ params }: LoaderArgs) => {
  return null
}

export default function EditCitationId() {
  return (
    <React.Fragment>
      <PageHeader>Create citation</PageHeader>
      <hr className="my-6" />
      <Form action={`/bank/create`} method={`post`}>
        <div className="flex gap-x-12">
          <div className="flex w-1/2 flex-col gap-y-4">
            <BankEditCitationFields />
          </div>
          <div className="flex w-1/2 flex-col gap-y-4">
            <BankSourcePanel />
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
