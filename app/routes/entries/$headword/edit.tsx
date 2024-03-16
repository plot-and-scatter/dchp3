import { DefaultErrorBoundary } from "~/components/elements/DefaultErrorBoundary"
import { getEntryByHeadword, updateLogEntries } from "~/models/entry.server"
import { handleEditFormAction } from "./handleEditFormAction"
import { redirectIfUserLacksEntryEditPermission } from "~/services/auth/session.server"
import { useLoaderData } from "@remix-run/react"
import EntryEditor from "~/components/EntryEditor/EntryEditor"
import invariant from "tiny-invariant"
import {
  type SerializeFrom,
  type ActionArgs,
  type LoaderArgs,
  redirect,
} from "@remix-run/node"
import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"

export type EntryEditLoaderData = SerializeFrom<
  Awaited<Promise<ReturnType<typeof loader>>>
>

export async function action({ params, request }: ActionArgs) {
  invariant(params.headword, "No headword specified")

  const formData = await request.formData()

  const result = await handleEditFormAction(formData)

  const headword = params.headword

  console.log("result", result.value.entryEditorFormAction)

  // Headword may have changed and data.headword exists; redirect if so
  if (
    result.value.entryEditorFormAction ===
    EntryEditorFormActionEnum.UPDATE_ENTRY
  ) {
    console.log("==> Redirecting....")
    await updateLogEntries(result.value.headword, request)
    return redirect(`/entries/${result.value.headword}/edit`)
  } else {
    console.log("==> No change.")
    await updateLogEntries(headword, request)
  }

  return null
}

export async function loader({ request, params }: LoaderArgs) {
  const { headword } = params

  invariant(headword, `No headword param provided`)

  // Ensure user has permission to edit the entry
  await redirectIfUserLacksEntryEditPermission(request, headword)

  // Find the entry and return a 404 if not found
  const entry = await getEntryByHeadword({ headword })
  if (!entry) {
    throw new Response(`Entry ${headword} not found`, {
      status: 404,
    })
  }

  return { entry }
}

export default function EntryDetailsPage() {
  const { entry } = useLoaderData()

  return <EntryEditor entry={entry} />
}

export const ErrorBoundary = DefaultErrorBoundary
