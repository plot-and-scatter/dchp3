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
import invariant from "tiny-invariant"
import PaginationControl from "~/components/bank/PaginationControl"

const PAGE_SIZE = 10

export const loader = async ({ request, params }: LoaderArgs) => {
  await redirectIfUserLacksPermission(request, "bank:create")

  const userId = await getUserId(request)
  if (!userId) throw json({ message: `No userId on user` }, { status: 500 })

  const { pageNumber } = params
  invariant(pageNumber, "No pageNumber supplied")

  const pageNumberAsNumber = +pageNumber

  const skip = +(pageNumberAsNumber || 1) - 1

  const criteria = {
    OR: [{ user_id: userId }, { last_modified_user_id: userId }],
  }

  const citationCount = await prisma.bankCitation.count({ where: criteria })
  const pageCount = Math.ceil(citationCount / PAGE_SIZE)

  const citations = await prisma.bankCitation.findMany({
    select: DEFAULT_CITATION_SELECT,
    where: criteria,
    take: PAGE_SIZE,
    skip: skip * PAGE_SIZE,
  })

  return { citations, citationCount, pageCount, pageNumber: pageNumberAsNumber }
}

export type OwnCitationsLoaderData = Awaited<Promise<ReturnType<typeof loader>>>

export default function OwnCitations() {
  const { citations, citationCount, pageCount, pageNumber } =
    useLoaderData<typeof loader>()

  return (
    <>
      <PageHeader>Owned citations</PageHeader>
      <p className="text-center">
        Page {pageNumber} of {pageCount}, {citationCount} citations total
      </p>
      <PaginationControl
        baseLink="/bank/own"
        currentPage={pageNumber}
        pageCount={pageCount}
      />
      <hr className="my-4" />
      <div>
        {citations.map((citation) => (
          <BankOwnCitationResult key={citation.id} citation={citation} />
        ))}
      </div>
      <hr className="my-4" />
      <PaginationControl
        baseLink="/bank/own"
        currentPage={pageNumber}
        pageCount={pageCount}
      />
    </>
  )
}
