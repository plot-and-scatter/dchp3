import { json, type LoaderArgs } from "@remix-run/server-runtime"
import { useLoaderData } from "@remix-run/react"
import { PageHeader } from "~/components/elements/PageHeader"
import {
  getEmailFromSession,
  redirectIfUserLacksPermission,
} from "~/services/auth/session.server"
import { prisma } from "~/db.server"
import type { BankGetOwnCitation } from "~/models/bank.types"
import BankCitationResult from "~/components/bank/BankCitationResult"

export const loader = async ({ request }: LoaderArgs) => {
  await redirectIfUserLacksPermission(request, "bank:create")

  const email = await getEmailFromSession(request)
  if (!email) throw json({ message: `No email on user` }, { status: 500 })
  const citations = await prisma.$queryRaw<
    BankGetOwnCitation[]
  >`SELECT c.user_id, c.last_modified_user_id, c.text, c.id, c.short_meaning, c.spelling_variant, c.created, c.last_modified, h.headword, c.source_id, s.year_published, s.type_id, s.year_composed, p.name as place_name, u.email FROM citation AS c, headword AS h, source AS s, place AS p, user AS u WHERE c.headword_id=h.id AND c.source_id=s.id AND s.place_id=p.id AND c.user_id=u.id ORDER BY c.created DESC`

  return citations
}

export default function OwnCitations() {
  const citations = useLoaderData<typeof loader>()

  return (
    <>
      <PageHeader>Owned citations</PageHeader>
      {citations.map((citation) => (
        <BankCitationResult key={citation.id} citation={citation} />
      ))}
    </>
  )
}
