import { Form, useActionData, useLoaderData } from "@remix-run/react"
import {
  getCitationsByHeadwordAndUserId,
  findOrCreateHeadword,
  findOrCreateAuthor,
  findOrCreatePlace,
  findOrCreateTitle,
  getFullCitationById,
} from "~/models/bank.server"
import { getEmailFromSession } from "~/services/auth/session.server"
import { getUserIdByEmailOrThrow } from "~/models/user.server"
import {
  json,
  type ActionArgs,
  type LoaderArgs,
  redirect,
} from "@remix-run/server-runtime"
import { PageHeader } from "~/components/elements/Headings/PageHeader"
import { prisma } from "~/db.server"
import BankEditCitationFields from "~/components/bank/BankEditCitationFields"
import BankHeadwordCitationSelect from "~/components/bank/BankHeadwordCitationSelect"
import BankSourcePanel from "~/components/bank/BankSourcePanels/BankSourcePanel"
import Button from "~/components/elements/LinksAndButtons/Button"
import invariant from "tiny-invariant"
import { parse } from "@conform-to/zod"
import { bankCitationFormDataSchema } from "../create"
import { useFieldset, useForm } from "@conform-to/react"

export const action = async ({ request, params }: ActionArgs) => {
  const formData = await request.formData()
  const submission = parse(formData, { schema: bankCitationFormDataSchema })
  if (submission.intent !== "submit" || !submission.value) {
    return json(submission)
  }

  const parsedData = submission.value

  const { headword, ...restOfCitation } = parsedData.citation

  const citationId = parseInt(params.citationId || "0")
  invariant(citationId)

  const email = await getEmailFromSession(request)
  if (!email) throw json({ message: `No email on user` }, { status: 500 })
  const userId = await getUserIdByEmailOrThrow({ email })

  // If the buttonIntent is delete, delete the citation.
  if (submission.payload[`buttonIntent`] === `delete`) {
    await prisma.bankCitation.delete({ where: { id: citationId } })
    return redirect(`/bank/own`)
  }

  // Find or create the headword
  const headwordId = await findOrCreateHeadword(headword)

  await prisma.bankCitation.update({
    where: { id: citationId },
    data: {
      id: citationId,
      ...restOfCitation,
      headword_id: headwordId,
      last_modified: new Date(),
      last_modified_user_id: userId,
    },
  })

  const authorId = await findOrCreateAuthor(parsedData[`author`])
  const titleId = await findOrCreateTitle(parsedData[`title`])
  const placeId = await findOrCreatePlace(parsedData[`place`])

  const { id: sourceId, ...restOfSource } = parsedData.source
  invariant(sourceId, "No sourceId provided")
  await prisma.bankSource.update({
    where: { id: sourceId },
    data: {
      author_id: authorId,
      title_id: titleId,
      place_id: placeId,
      ...restOfSource,
    },
  })

  return redirect(`/bank/edit/${citationId}`)
}

export const loader = async ({ params }: LoaderArgs) => {
  const citationId = params.citationId
  invariant(citationId, `citationId not found`)

  const citation = await getFullCitationById(citationId)
  if (!citation) {
    throw new Response(`No citation found with id ${citationId}`, {
      status: 404,
    })
  }

  const response = await Promise.all([
    getCitationsByHeadwordAndUserId(
      citation.headword?.headword || null,
      citation.user_id
    ),
  ]).then((responses) => ({ headwordCitations: responses[0] }))

  return { citation, ...response }
}

export type EditCitationIdLoaderData = Awaited<
  Promise<ReturnType<typeof loader>>
>

export default function EditCitationId() {
  const data = useLoaderData<typeof loader>()

  const { citation, headwordCitations } = data

  const lastSubmission = useActionData<typeof action>()

  const [form, { citation: _citation }] = useForm({
    lastSubmission,
    shouldValidate: "onInput", // Run the same validation logic on client
    onValidate({ formData }) {
      return parse(formData, { schema: bankCitationFormDataSchema })
    },
  })

  const citationFields = useFieldset(form.ref, _citation)

  return (
    <Form {...form.props} method="POST">
      <PageHeader>Editing citation</PageHeader>
      <BankHeadwordCitationSelect
        citations={headwordCitations}
        currentCitation={citation}
      />
      <hr className="my-6" />
      <div className="flex gap-x-12">
        <div className="flex w-1/2 flex-col gap-y-4">
          <BankEditCitationFields
            {...data}
            key={citation.id}
            citationFields={citationFields}
          />
        </div>
        <div className="flex w-1/2 flex-col gap-y-4">
          <BankSourcePanel {...data} key={citation.id} />
          <div className="mx-auto mt-12 flex items-center gap-x-12">
            <div>
              <Button
                appearance="success"
                size="large"
                name="buttonIntent"
                value="save"
              >
                <i className="fa-solid fa-download mr-2" /> Save citation
              </Button>
            </div>
            <div>
              <Button appearance="danger" name="buttonIntent" value="delete">
                <i className="fa-solid fa-xmark mr-2" /> Delete citation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Form>
  )
}
