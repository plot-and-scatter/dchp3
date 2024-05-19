import {
  canUserEditEntry as _canUserEditEntry,
  userHasPermission,
} from "~/services/auth/session.server"
import { DefaultErrorBoundary } from "~/components/elements/DefaultErrorBoundary"
import { getEntryByHeadword } from "~/models/entry.server"
import { useLoaderData } from "@remix-run/react"
import Entry from "~/components/Entry/Entry"
import invariant from "tiny-invariant"
import {
  json,
  type LoaderArgs,
  type MetaFunction,
  type SerializeFrom,
} from "@remix-run/node"
import { BASE_APP_TITLE } from "~/root"

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return {
    title: `${BASE_APP_TITLE} | ${data?.entry?.headword || "Entry not found"}`,
  }
}

export async function loader({ request, params }: LoaderArgs) {
  const headword = params.headword

  invariant(headword, "Headword not found")

  const entry = await getEntryByHeadword({ headword: headword })

  if (!entry) {
    throw json(`No entry found for headword ${headword}.`, {
      status: 404,
      statusText: "entry-not-found",
    })
  }

  const canUserEditEntry = await _canUserEditEntry(request, headword)

  const canUserViewDraftEntry = await userHasPermission(
    request,
    "det:viewEdits"
  )

  const canUserViewEntry = entry.is_public || canUserViewDraftEntry

  if (!canUserViewEntry) {
    throw json(
      `You do not have permission to view this entry. Please log in or contact an administrator.`,
      {
        status: 403,
        statusText: "forbidden",
      }
    )
  }

  return { entry, canUserEditEntry, canUserViewDraftEntry }
}

export type LoadedEntryDataType = SerializeFrom<
  Awaited<Promise<ReturnType<typeof loader>>>
>["entry"]

export default function EntryDetailsPage() {
  const data = useLoaderData<typeof loader>()

  return <Entry {...data} />
}

export const ErrorBoundary = DefaultErrorBoundary
