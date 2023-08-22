import type { LoaderArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Link, useCatch, useLoaderData, useParams } from "@remix-run/react"
import invariant from "tiny-invariant"
import BankCitationResult from "~/components/bank/BankCitationResult"
import { prisma } from "~/db.server"
import type { BankGetOwnCitation } from "~/models/bank.types"

export async function loader({ params }: LoaderArgs) {
  invariant(params.headword, "headword not found")

  const query = `${params.headword}`

  const citations = await prisma.$queryRaw<
    BankGetOwnCitation[]
  >`SELECT c.user_id, c.last_modified_user_id, c.text, c.id, c.short_meaning, c.spelling_variant, c.created, c.last_modified, h.headword, c.source_id, s.year_published, s.type_id, s.year_composed, p.name as place_name, u.email FROM citation AS c, headword AS h, source AS s, place AS p, user AS u WHERE h.headword LIKE ${query} AND c.headword_id=h.id AND c.source_id=s.id AND s.place_id=p.id AND c.user_id=u.id ORDER BY c.created ASC`

  console.log("citations", citations)

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
        {citations.map((c) => {
          return <BankCitationResult citation={c} key={c.id} />
        })}
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
