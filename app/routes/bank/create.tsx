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

export const bankCitationFormDataSchema = z.object({
  citation: z.object({
    headword: z.string().min(1, "Headword must be at least one character long"),
    clip_end: z.number().min(0),
    clip_start: z.number().min(0),
    clipped_text: z.string().optional().nullable(),
    legacy_id: z.number().min(0),
    memo: z.string().optional().nullable(),
    part_of_speech: z.string().optional().nullable(),
    short_meaning: z.string().optional().nullable(),
    spelling_variant: z.string().optional().nullable(),
    text: z.string().optional().nullable(),
    is_incomplete: z
      .union([z.literal("true"), z.literal("false")])
      .optional()
      .nullable()
      .transform((val) => (val === "true" ? 1 : null)),
  }),
  source: z.object({
    id: z.number().optional(),
    dateline: z.string().optional(),
    editor: z.string().optional(),
    evidence: z.string().optional(),
    page: z.string().optional(),
    periodical_date: z.string().optional(),
    publisher: z.string().optional(),
    type_id: z.number().min(0),
    url_access_date: z.string().optional(),
    url: z.string().optional(),
    utterance_broadcast: z.string().optional(),
    utterance_media: z.string().optional(),
    utterance_time: z.string().optional(),
    utterance_witness: z.string().optional(),
    uttered: z.string().optional(),
    volume_issue: z.string().optional(),
    year_composed: z.string().optional(),
    year_published: z.string().optional(),
  }),
  [`author`]: z.string().optional(),
  [`place`]: z.string().optional(),
  [`title`]: z.string().optional(),
})

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()

  console.log("formData", formData)

  const submission = parse(formData, { schema: bankCitationFormDataSchema })

  console.log("=----=---- submission", submission)

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
