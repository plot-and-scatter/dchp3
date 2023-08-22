import { json, type LoaderArgs } from "@remix-run/server-runtime"
import { useCatch, useLoaderData } from "@remix-run/react"
import { PageHeader } from "~/components/elements/PageHeader"
import {
  getEmailFromSession,
  redirectIfUserLacksPermission,
} from "~/services/auth/session.server"
import BankCitationResult from "~/components/bank/BankCitationResult"
import getOwnCitations from "~/services/bank/getOwnCitations"
import { prisma } from "~/db.server"
import BankCitationResultAlt from "~/components/bank/BankCitationResultAlt"
import { getUserIdByEmail } from "~/models/user.server"

export const loader = async ({ request }: LoaderArgs) => {
  await redirectIfUserLacksPermission(request, "bank:create")

  const email = await getEmailFromSession(request)
  if (!email) throw json({ message: `No email on user` }, { status: 500 })

  const citations = await getOwnCitations(email)

  // TODO: Leaving this here as an example of an alternative to the custom SQL.
  // const userId = await getUserIdByEmail({ email })
  // const myCitations = await prisma.bankCitation.findMany({
  //   where: { OR: [{ user_id: userId }, { last_modified_user_id: userId }] },
  //   select: {
  //     user_id: true,
  //     last_modified_user_id: true,
  //     text: true,
  //     id: true,
  //     short_meaning: true,
  //     last_modified: true,
  //     source_id: true,
  //     spelling_variant: true,
  //     headword: {
  //       select: { headword: true },
  //     },
  //     source: {
  //       select: {
  //         year_published: true,
  //         year_composed: true,
  //         type_id: true,
  //         place: {
  //           select: {
  //             name: true,
  //           },
  //         },
  //       },
  //     },
  //   },
  // })

  // console.log("myCitations", myCitations)

  return {
    citations,
    // myCitations,
  } as const
}

export type OwnCitationsLoaderData = Awaited<Promise<ReturnType<typeof loader>>>

export default function OwnCitations() {
  const { citations /* myCitations */ } = useLoaderData<typeof loader>()

  return (
    <>
      <PageHeader>Owned citations</PageHeader>
      {citations.map((citation) => (
        <BankCitationResult key={citation.id} citation={citation} />
      ))}
      {/* {myCitations.map((myCitation) => (
        <BankCitationResultAlt key={myCitation.id} citation={myCitation} />
      ))} */}
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
