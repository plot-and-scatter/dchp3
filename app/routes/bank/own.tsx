import { getOwnCitations } from "~/models/bank.server"
import { json, type LoaderArgs } from "@remix-run/server-runtime"
import { useCatch, useLoaderData } from "@remix-run/react"
import { PageHeader } from "~/components/elements/PageHeader"
import {
  getEmailFromSession,
  redirectIfUserLacksPermission,
} from "~/services/auth/session.server"
import BankCitationResult from "~/components/bank/BankCitationResult"

export const loader = async ({ request }: LoaderArgs) => {
  await redirectIfUserLacksPermission(request, "bank:create")

  const email = await getEmailFromSession(request)
  if (!email) throw json({ message: `No email on user` }, { status: 500 })
  const citations = await getOwnCitations(email)

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

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error)

  return <div>An unexpected error occurred: {error.message}</div>
}

export function CatchBoundary() {
  const caught = useCatch()

  if (caught.status === 404) {
    return <div>Entry not found</div>
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`)
}
