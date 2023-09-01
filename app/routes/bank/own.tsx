import {
  getUserId,
  redirectIfUserLacksPermission,
} from "~/services/auth/session.server"
import { DEFAULT_CITATION_SELECT } from "~/services/bank/defaultCitationSelect"
import { json, type LoaderArgs } from "@remix-run/server-runtime"
import { PageHeader } from "~/components/elements/PageHeader"
import { prisma } from "~/db.server"
import { useLoaderData } from "@remix-run/react"
import BankOwnCitationResult from "~/components/bank/BankOwnCitationResult"

export const loader = async ({ request }: LoaderArgs) => {
  await redirectIfUserLacksPermission(request, "bank:create")

  const userId = await getUserId(request)
  if (!userId) throw json({ message: `No userId on user` }, { status: 500 })

  const citations = await prisma.bankCitation.findMany({
    select: DEFAULT_CITATION_SELECT,
    where: { OR: [{ user_id: userId }, { last_modified_user_id: userId }] },
    take: 100,
  })

  return { citations }
}

export type OwnCitationsLoaderData = Awaited<Promise<ReturnType<typeof loader>>>

export default function OwnCitations() {
  const { citations } = useLoaderData<typeof loader>()

  return (
    <>
      <PageHeader>Owned citations (temp limit 100)</PageHeader>
      {citations.map((citation) => (
        <BankOwnCitationResult key={citation.id} citation={citation} />
      ))}
    </>
  )
}
