import { DEFAULT_CITATION_SELECT } from "~/services/bank/defaultCitationSelect"
import { DefaultErrorBoundary } from "~/components/elements/DefaultErrorBoundary"
import { prisma } from "~/db.server"
import { useLoaderData, useParams } from "@remix-run/react"
import BankOwnCitationResult from "~/components/bank/BankOwnCitationResult"
import invariant from "tiny-invariant"
import type { LoaderArgs } from "@remix-run/node"

export async function loader({ params }: LoaderArgs) {
  invariant(params.headword, "headword not found")

  const citations = await prisma.bankCitation.findMany({
    select: DEFAULT_CITATION_SELECT,
    where: { headword: { headword: params.headword } },
  })

  return { citations }
}

export default function EntryDetailsPage() {
  const { citations } = useLoaderData<typeof loader>()
  const params = useParams()

  return (
    <div>
      <h3 className="text-2xl font-bold">
        <>
          Citations for {params.headword}: {citations.length}
        </>
      </h3>
      <div className="my-4 flex flex-col justify-center">
        {citations.map((c) => (
          <BankOwnCitationResult citation={c} key={c.id} />
        ))}
      </div>
    </div>
  )
}

export const ErrorBoundary = DefaultErrorBoundary
