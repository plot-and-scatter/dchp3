import type { Prisma } from "@prisma/client"
import { type LoaderArgs } from "@remix-run/node"
import { useCatch, useLoaderData } from "@remix-run/react"
import invariant from "tiny-invariant"

import { getEntryByHeadword } from "~/models/entry.server"

import Entry from "~/components/Entry"
export async function loader({ params }: LoaderArgs) {
  invariant(params.headword, "headword not found")

  const entry = await getEntryByHeadword({ headword: params.headword })
  if (!entry) {
    throw new Response("Not Found", { status: 404 })
  }
  return entry
}

export type LoadedDataType = Prisma.PromiseReturnType<typeof loader>

export default function EntryDetailsPage() {
  const data = useLoaderData<typeof loader>() as LoadedDataType

  return <Entry data={data} />
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
