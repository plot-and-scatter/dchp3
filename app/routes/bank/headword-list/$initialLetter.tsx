import type { LoaderArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Link, useCatch, useLoaderData, useParams } from "@remix-run/react"
import invariant from "tiny-invariant"
import { prisma } from "~/db.server"

export async function loader({ params }: LoaderArgs) {
  invariant(params.initialLetter, "initialLetter not found")

  const query = `${params.initialLetter}%`

  const headwords = await prisma.$queryRaw<
    {
      id: number
      headword: string
      count: number
    }[]
  >`SELECT headword, count('c.id') AS count FROM citation c INNER JOIN headword h ON c.headword_id = h.id INNER JOIN user u ON c.user_id = u.id WHERE UPPER(headword) LIKE UPPER(${query}) GROUP BY UPPER(headword), h.id ORDER BY UPPER(headword)`

  console.log("headwords", headwords)

  return { headwords }
}

export default function EntryDetailsPage() {
  const { headwords } = useLoaderData<typeof loader>()
  const params = useParams()

  return (
    <div>
      <h3 className="text-2xl font-bold">
        <>
          Entries starting with {params.initialLetter}: {headwords.length}
        </>
      </h3>
      <div className="my-4 flex flex-col justify-center">
        {headwords.map((h) => {
          return (
            <p className="" key={h.headword}>
              <strong>{h.headword}</strong> (<strong>{h.count}</strong>{" "}
              citations){" "}
              <Link
                to={`/bank/citations/${h.headword}`}
                className="font-bold text-red-600 hover:text-red-400"
              >
                View citations
              </Link>
            </p>
          )
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
