import type { LoaderArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Link, useCatch, useLoaderData, useParams } from "@remix-run/react"
import invariant from "tiny-invariant"

import { getEntriesByBasicTextSearch } from "~/models/entry.server"

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.text, "text not found")

  const url = new URL(request.url);
  const caseSensitive: boolean = url.searchParams.get("caseSensitive") === "true";

  // TODO1: add the parameters here
  const entries = await getEntriesByBasicTextSearch(params.text)
  if (!entries) {
    throw new Response("Not Found", { status: 404 })
  }
  return json({ entries })
}

export default function EntryDetailsPage() {
  const data = useLoaderData<typeof loader>()
  const params = useParams()

  return (
    <div className="mt-3">
      <h3 className="text-xl font-bold">
        <>
          Entries containing &ldquo;{params.text}&rdquo;: {data.entries.length}
        </>
      </h3>
      {data.entries.map((e) => {
        return (
          <p key={e.id}>
            <Link
              to={`/entries/${e.headword}`}
              className="font-bold text-red-600 hover:text-red-400"
            >
              {e.headword}
            </Link>
          </p>
        )
      })}
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
