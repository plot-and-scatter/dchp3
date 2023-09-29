import {
  findOrCreateHeadword,
  findOrCreateAuthor,
  findOrCreatePlace,
  findOrCreateTitle,
} from "~/models/bank.server"
import { Form } from "@remix-run/react"
import { getEmailFromSession } from "~/services/auth/session.server"
import { getUserIdByEmail } from "~/models/user.server"
import { json, type ActionArgs, redirect } from "@remix-run/server-runtime"
import { PageHeader } from "~/components/elements/PageHeader"
import { prisma } from "~/db.server"
import { z } from "zod"
import BankEditCitationFields from "~/components/bank/BankEditCitationFields"
import BankSourcePanel from "~/components/bank/BankSourcePanels/BankSourcePanel"
import Button from "~/components/elements/LinksAndButtons/Button"
import invariant from "tiny-invariant"

const BankCreateFormDataSchema = z.object({
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

export const action = async ({ request }: ActionArgs) => {
  const data = Object.fromEntries(await request.formData())
  const parsedData = BankCreateFormDataSchema.parse(data)

  const headword = parsedData[`citation.headword`]
  invariant(headword)
  // TODO: Use more invariants + exception catchers

  const email = await getEmailFromSession(request)
  if (!email) throw json({ message: `No email on user` }, { status: 500 })
  const userId = await getUserIdByEmail({ email })

  // Find or create the headword
  const headwordId = await findOrCreateHeadword(headword)

  const authorId = await findOrCreateAuthor(parsedData[`author`])
  const placeId = await findOrCreatePlace(parsedData[`place`])
  const titleId = await findOrCreateTitle(parsedData[`title`])

  // Create the source
  const source = await prisma.bankSource.create({
    data: {
      author_id: authorId,
      place_id: placeId,
      title_id: titleId,
      dateline: parsedData[`source.dateline`],
      editor: parsedData[`source.editor`],
      evidence: parsedData[`source.evidence`],
      page: parsedData[`source.page`],
      periodical_date: parsedData[`source.periodical_date`],
      publisher: parsedData[`source.publisher`],
      type_id: parsedData[`source.type_id`],
      url_access_date: parsedData[`source.url_access_date`],
      url: parsedData[`source.url`],
      utterance_broadcast: parsedData[`source.utterance_broadcast`],
      utterance_media: parsedData[`source.utterance_media`],
      utterance_time: parsedData[`source.utterance_time`],
      utterance_witness: parsedData[`source.utterance_witness`],
      uttered: parsedData[`source.uttered`],
      volume_issue: parsedData[`source.volume_issue`],
      year_composed: parsedData[`source.year_composed`],
      year_published: parsedData[`source.year_published`],
    },
  })

  // Create the citation
  const citation = await prisma.bankCitation.create({
    data: {
      source_id: source.id,
      headword_id: headwordId,
      memo: parsedData[`citation.memo`],
      short_meaning: parsedData[`citation.short_meaning`],
      spelling_variant: parsedData[`citation.spelling_variant`],
      part_of_speech: parsedData[`citation.part_of_speech`],
      text: parsedData[`citation.text`],
      clip_start: parsedData[`citation.clip_start`],
      clip_end: parsedData[`citation.clip_end`],
      clipped_text: parsedData[`citation.clipped_text`],
      legacy_id: parsedData[`citation.legacy_id`],
      is_incomplete: parsedData[`citation.is_incomplete`],
      created: new Date(),
      user_id: userId,
    },
  })

  return redirect(`/bank/edit/${citation.id}`)
}

export const loader = async () => {
  return null
}

export default function BankCreate() {
  return (
    <Form>
      <PageHeader>Create citation</PageHeader>
      <hr className="my-6" />
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
  )
}
