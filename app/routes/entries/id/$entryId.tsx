import { DefaultErrorBoundary } from "~/components/elements/DefaultErrorBoundary"
import { getEntryById } from "~/models/entry.server"
import { json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import invariant from "tiny-invariant"
import type { LoaderArgs } from "@remix-run/node"

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

export const ErrorBoundary = DefaultErrorBoundary
