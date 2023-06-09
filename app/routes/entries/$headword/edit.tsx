import { useLoaderData } from "@remix-run/react"
import { type LoadedDataType } from "."
import { type LoaderArgs } from "@remix-run/server-runtime"
import invariant from "tiny-invariant"
import { getEntryByHeadword } from "~/models/entry.server"

export async function loader({ params }: LoaderArgs) {
  invariant(params.headword, "headword not found")

  const entry = await getEntryByHeadword({ headword: params.headword })
  if (!entry) {
    throw new Response("Not Found", { status: 404 })
  }
  return entry
}

export default function EditEntryPage() {
  const data = useLoaderData<typeof loader>() as LoadedDataType

  return (
    <div>
      <p> Work In Progress. Entry: {data.headword}</p>
    </div>
  )
}
