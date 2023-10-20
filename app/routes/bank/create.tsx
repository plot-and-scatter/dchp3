import {
  findOrCreateHeadword,
  findOrCreateAuthor,
  findOrCreatePlace,
  findOrCreateTitle,
} from "~/models/bank.server"
import { DefaultErrorBoundary } from "~/components/elements/DefaultErrorBoundary"
import { Form, useActionData } from "@remix-run/react"
import { getEmailFromSession } from "~/services/auth/session.server"
import { getUserIdByEmailOrThrow } from "~/models/user.server"
import { json, type ActionArgs, redirect } from "@remix-run/server-runtime"
import { PageHeader } from "~/components/elements/PageHeader"
import { parse } from "@conform-to/zod"
import { prisma } from "~/db.server"
import { useFieldset, useForm } from "@conform-to/react"
import { z } from "zod"
import BankEditCitationFields from "~/components/bank/BankEditCitationFields"
import BankSourcePanel from "~/components/bank/BankSourcePanels/BankSourcePanel"
import Button from "~/components/elements/LinksAndButtons/Button"

export const emptyStringToNull = z
  .string()
  .nullish()
  .transform((x) => {
    return x === undefined ? null : x
  })

export const bankCitationFormDataSchema = z.object({
  citation: z.object({
    headword: z.string().min(1, "Headword must be at least one character long"),
    clip_end: z.number().min(0),
    clip_start: z.number().min(0),
    clipped_text: emptyStringToNull,
    legacy_id: z.number().min(0),
    memo: emptyStringToNull,
    part_of_speech: emptyStringToNull,
    short_meaning: emptyStringToNull,
    spelling_variant: emptyStringToNull,
    text: emptyStringToNull,
    is_incomplete: z
      .union([z.literal("true"), z.literal("false")])
      .optional()
      .nullable()
      .transform((val) => (val === "true" ? 1 : null)),
  }),
  source: z.object({
    id: z.number().optional(),
    dateline: emptyStringToNull,
    editor: emptyStringToNull,
    evidence: emptyStringToNull,
    page: emptyStringToNull,
    periodical_date: emptyStringToNull,
    publisher: emptyStringToNull,
    type_id: z.number().min(0),
    url_access_date: emptyStringToNull,
    url: emptyStringToNull,
    utterance_broadcast: emptyStringToNull,
    utterance_media: emptyStringToNull,
    utterance_time: emptyStringToNull,
    utterance_witness: emptyStringToNull,
    uttered: emptyStringToNull,
    volume_issue: emptyStringToNull,
    year_composed: emptyStringToNull,
    year_published: emptyStringToNull,
  }),
  [`author`]: emptyStringToNull,
  [`place`]: emptyStringToNull,
  [`title`]: emptyStringToNull,
})

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  const submission = parse(formData, { schema: bankCitationFormDataSchema })
  if (submission.intent !== "submit" || !submission.value) {
    return json(submission)
  }

  const parsedData = submission.value

  const { headword, ...restOfCitation } = parsedData.citation

  const email = await getEmailFromSession(request)
  if (!email) throw json({ message: `No email on user` }, { status: 500 })
  const userId = await getUserIdByEmailOrThrow({ email })

  // Find or create the headword
  const headwordId = await findOrCreateHeadword(headword)

  const authorId = await findOrCreateAuthor(parsedData[`author`])
  const placeId = await findOrCreatePlace(parsedData[`place`])
  const titleId = await findOrCreateTitle(parsedData[`title`])

  // Create the source, stripping off the sourceId
  const { id: _sourceId, ...restOfSource } = parsedData.source
  const source = await prisma.bankSource.create({
    data: {
      ...restOfSource,
      author_id: authorId,
      place_id: placeId,
      title_id: titleId,
    },
  })

  // Create the citation
  const savedCitation = await prisma.bankCitation.create({
    data: {
      ...restOfCitation,
      source_id: source.id,
      headword_id: headwordId,
      created: new Date(),
      user_id: userId,
    },
  })

  return redirect(`/bank/edit/${savedCitation.id}`)
}

export const loader = async () => {
  return null
}

export default function BankCreate() {
  const lastSubmission = useActionData<typeof action>()

  const [form, { citation }] = useForm({
    lastSubmission,
    shouldValidate: "onInput", // Run the same validation logic on client
    onValidate({ formData }) {
      return parse(formData, { schema: bankCitationFormDataSchema })
    },
  })

  const citationFields = useFieldset(form.ref, citation)

  return (
    <Form {...form.props} method="POST">
      <PageHeader>Create citation</PageHeader>
      <hr className="my-6" />
      <div className="flex gap-x-12">
        <div className="flex w-1/2 flex-col gap-y-4">
          <BankEditCitationFields citationFields={citationFields} />
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
  )
}

export const ErrorBoundary = DefaultErrorBoundary
