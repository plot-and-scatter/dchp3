import { DefaultErrorBoundary } from "~/components/elements/DefaultErrorBoundary"
import { getEntryByHeadword } from "~/models/entry.server"
import { type LoaderArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import Entry from "~/components/Entry"
import invariant from "tiny-invariant"
import type { Prisma } from "@prisma/client"

export async function loader({ params }: LoaderArgs) {
  invariant(params.headword, "headword not found")

  const entry = await getEntryByHeadword({ headword: params.headword })

  if (!entry) {
    throw new Response("Not Found", { status: 404 })
  }

  // Rewrite image URLs
  entry.images.forEach(
    (i) => (i.path = `${process.env.IMAGE_BUCKET_PREFIX}${i.path}`)
  )

  return entry
}

export type LoadedDataType = Prisma.PromiseReturnType<typeof loader>

export default function EntryDetailsPage() {
  const data = useLoaderData<typeof loader>() as LoadedDataType

  return <Entry data={data} />
}

export const ErrorBoundary = DefaultErrorBoundary
