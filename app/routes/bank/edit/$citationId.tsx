import { Form, useLoaderData } from "@remix-run/react"
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
import { PageHeader } from "~/components/elements/PageHeader"
import { prisma } from "~/db.server"
import { z } from "zod"
import BankEditCitationFields from "~/components/bank/BankEditCitationFields"
import BankHeadwordCitationSelect from "~/components/bank/BankHeadwordCitationSelect"
import BankSourcePanel from "~/components/bank/BankSourcePanels/BankSourcePanel"
import Button from "~/components/elements/LinksAndButtons/Button"
import invariant from "tiny-invariant"

const BankEditFormDataSchema = z.object({
  [`citation.headword`]: z.string(),
  [`citation.clip_end`]: z.coerce.number().nonnegative().nullable(),
  [`citation.clip_start`]: z.coerce.number().nonnegative().nullable(),
  [`citation.clipped_text`]: z.string().nullable(),
  [`citation.legacy_id`]: z.coerce.number().nullable(),
  [`citation.memo`]: z.string().nullable(),
  [`citation.part_of_speech`]: z.string().nullable(),
  [`citation.short_meaning`]: z.string().nullable(),
  [`citation.spelling_variant`]: z.string().nullable(),
  [`citation.text`]: z.string().nullable(),
  [`citation.is_incomplete`]: z
    .union([z.literal("true"), z.literal("false")])
    .nullable()
    .transform((val) => (val === "true" ? 1 : null)),
  [`source.id`]: z.coerce.number(),
  [`source.dateline`]: z.string().nullish(),
  [`source.editor`]: z.string().nullish(),
  [`source.evidence`]: z.string().nullish(),
  [`source.page`]: z.string().nullish(),
  [`source.periodical_date`]: z.string().nullish(),
  [`source.publisher`]: z.string().nullish(),
  [`source.type_id`]: z.coerce.number(),
  [`source.url_access_date`]: z.string().nullish(),
  [`source.url`]: z.string().nullish(),
  [`source.utterance_broadcast`]: z.string().nullish(),
  [`source.utterance_media`]: z.string().nullish(),
  [`source.utterance_time`]: z.string().nullish(),
  [`source.utterance_witness`]: z.string().nullish(),
  [`source.uttered`]: z.string().nullish(),
  [`source.volume_issue`]: z.string().nullish(),
  [`source.year_composed`]: z.string().nullish(),
  [`source.year_published`]: z.string().nullish(),
  [`author`]: z.string().nullable(),
  [`place`]: z.string().nullable(),
  [`title`]: z.string().nullable(),
})

export const action = async ({ request, params }: ActionArgs) => {
  const data = Object.fromEntries(await request.formData())
  const parsedData = BankEditFormDataSchema.parse(data)

  const headword = parsedData[`citation.headword`]
  invariant(headword)
  // TODO: Use more invariants + exception catchers

  const citationId = parseInt(params.citationId || "0")
  invariant(citationId)

  const email = await getEmailFromSession(request)
  if (!email) throw json({ message: `No email on user` }, { status: 500 })
  const userId = await getUserIdByEmailOrThrow({ email })

  // Find or create the headword
  const headwordId = await findOrCreateHeadword(headword)

  await prisma.bankCitation.update({
    where: { id: citationId },
    data: {
      id: citationId,
      memo: parsedData[`citation.memo`],
      headword_id: headwordId,
      short_meaning: parsedData[`citation.short_meaning`],
      spelling_variant: parsedData[`citation.spelling_variant`],
      part_of_speech: parsedData[`citation.part_of_speech`],
      text: parsedData[`citation.text`],
      clip_start: parsedData[`citation.clip_start`],
      clip_end: parsedData[`citation.clip_end`],
      clipped_text: parsedData[`citation.clipped_text`],
      last_modified: new Date(),
      last_modified_user_id: userId,
      legacy_id: parsedData[`citation.legacy_id`],
      is_incomplete: parsedData[`citation.is_incomplete`],
    },
  })

  const authorId = await findOrCreateAuthor(parsedData[`author`])
  const titleId = await findOrCreateTitle(parsedData[`title`])
  const placeId = await findOrCreatePlace(parsedData[`place`])

  await prisma.bankSource.update({
    where: { id: parsedData[`source.id`] },
    data: {
      id: parsedData[`source.id`],
      type_id: parsedData[`source.type_id`],
      year_published: parsedData[`source.year_published`],
      page: parsedData[`source.page`],
      author_id: authorId,
      title_id: titleId,
      place_id: placeId,
      url: parsedData[`source.url`],
      url_access_date: parsedData[`source.url_access_date`],
      dateline: parsedData[`source.dateline`],
      periodical_date: parsedData[`source.periodical_date`],
      year_composed: parsedData[`source.year_composed`],
      publisher: parsedData[`source.publisher`],
      uttered: parsedData[`source.uttered`],
      utterance_witness: parsedData[`source.utterance_witness`],
      utterance_time: parsedData[`source.utterance_time`],
      utterance_media: parsedData[`source.utterance_media`],
      utterance_broadcast: parsedData[`source.utterance_broadcast`],
      volume_issue: parsedData[`source.volume_issue`],
      editor: parsedData[`source.editor`],
      evidence: parsedData[`source.evidence`],
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

  return (
    <Form>
      <PageHeader>Editing citation</PageHeader>
      <BankHeadwordCitationSelect
        citations={headwordCitations}
        currentCitation={citation}
      />
      <hr className="my-6" />
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
  )
}
