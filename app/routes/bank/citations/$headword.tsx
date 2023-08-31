import { prisma } from "~/db.server"
import { useCatch, useLoaderData, useParams } from "@remix-run/react"
import BankOwnCitationResult from "~/components/bank/BankOwnCitationResult"
import invariant from "tiny-invariant"
import type { LoaderArgs } from "@remix-run/node"
import { DEFAULT_CITATION_SELECT } from "~/services/bank/defaultCitationSelect"

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
