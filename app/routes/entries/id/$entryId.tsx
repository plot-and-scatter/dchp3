import type { LoaderArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { useCatch, useLoaderData } from "@remix-run/react"
import invariant from "tiny-invariant"

import { getEntryById } from "~/models/entry.server"

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.entryId, "entryId not found")

  const entry = await getEntryById({ id: parseInt(params.entryId) })
  if (!entry) {
    throw new Response("Not Found", { status: 404 })
  }
  return json({ entry })
}

export default function EntryDetailsPage() {
  const data = useLoaderData<typeof loader>()

  return (
    <div className="flex flex-row">
      <h3 className="text-2xl font-bold">{data.entry.id}</h3>
      <p className="py-6">{data.entry.headword}</p>
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
