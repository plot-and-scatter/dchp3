import { PageHeader } from "~/components/elements/PageHeader"
import { Form, useLoaderData } from "@remix-run/react"
import BankHeadwordCitationSelect from "~/components/bank/BankHeadwordCitationSelect"
import BankSourcePanel from "~/components/bank/BankSourcePanels/BankSourcePanel"
import Button from "~/components/elements/Button"
import invariant from "tiny-invariant"
import React from "react"
import type { ActionArgs, LoaderArgs } from "@remix-run/server-runtime"
import {
  getAuthorBySourceId,
  getCitationById,
  getCitationsByHeadwordAndUserId,
  getPlaceBySourceId,
  getTitleBySourceId,
  getUtteranceBySourceId,
} from "~/models/bank.server"
import BankEditCitationFields from "~/components/bank/BankEditCitationFields"

export const action = async ({ request, params }: ActionArgs) => {
  const data = Object.fromEntries(await request.formData())
  // TODO: Use invariants + exception catchers

  console.log("data", data)

  return {}
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
    getUtteranceBySourceId(sourceId),
    getCitationsByHeadwordAndUserId(citation.headword, citation.user_id),
  ]).then((responses) => {
    return {
      title: responses[0].name,
      place: responses[1].name,
      author: responses[2].name,
      utterance: responses[3],
      headwordCitations: responses[4],
    }
  })

  return { citation, ...response }
}

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
