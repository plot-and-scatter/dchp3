import { canUserEditEntry as _canUserEditEntry } from "~/services/auth/session.server"
import { DefaultErrorBoundary } from "~/components/elements/DefaultErrorBoundary"
import { getEntryByHeadword } from "~/models/entry.server"
import { useLoaderData } from "@remix-run/react"
import Entry from "~/components/Entry"
import invariant from "tiny-invariant"
import type { LoaderArgs, MetaFunction, SerializeFrom } from "@remix-run/node"
import { BASE_APP_TITLE } from "~/root"

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return {
    title: `${BASE_APP_TITLE} | ${data.entry.headword}`,
  }
}

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.headword, "headword not found")

  const entry = await getEntryByHeadword({ headword: params.headword })

  if (!entry) {
    throw new Response("Not Found", { status: 404 })
  }

  const canUserEditEntry = await _canUserEditEntry(request, params.headword)

  return { entry, canUserEditEntry }
}

export type LoadedEntryDataType = SerializeFrom<
  Awaited<Promise<ReturnType<typeof loader>>>
>["entry"]

export default function EntryDetailsPage() {
  const data = useLoaderData<typeof loader>()

  return <Entry data-id="Entry" {...data} />
}

export const ErrorBoundary = DefaultErrorBoundary
