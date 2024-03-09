import { DefaultErrorBoundary } from "~/components/elements/DefaultErrorBoundary"
import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import { getEntryByHeadword, updateLogEntries } from "~/models/entry.server"
import { getEntryEditorFormAction } from "~/utils/generalUtils"
import { handleEditFormAction } from "./handleEditFormAction"
import { prefixImageUrls } from "~/services/controllers/image/prefixImageUrls"
import { redirect } from "@remix-run/node"
import { redirectIfUserLacksEntryEditPermission } from "~/services/auth/session.server"
import { useLoaderData } from "@remix-run/react"
import EntryEditor from "~/components/EntryEditor/EntryEditor"
import invariant from "tiny-invariant"
import type { SerializeFrom, ActionArgs, LoaderArgs } from "@remix-run/node"

export type EntryEditLoaderData = SerializeFrom<
  Awaited<Promise<ReturnType<typeof loader>>>
>

export async function action({ params, request }: ActionArgs) {
  invariant(params.headword)
  const data = Object.fromEntries(await request.formData())
  const entryEditorFormAction = getEntryEditorFormAction(
    data.entryEditorFormAction
  )

  await handleEditFormAction(entryEditorFormAction, data)

  const headword = params.headword
  await updateLogEntries(headword, request)

  // Headword may have changed and data.headword exists; redirect if so
  if (entryEditorFormAction === EntryEditorFormActionEnum.ENTRY) {
    return redirect(`/entries/${data.headword}/edit`)
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
  if (!entry)
    throw new Response(`Entry ${headword} not found`, {
      status: 404,
    })

  // Prefix the image URLs
  await prefixImageUrls(entry)

  return { entry }
}

export default function EntryDetailsPage() {
  const { entry } = useLoaderData()

  return <EntryEditor entry={entry} />
}

export const ErrorBoundary = DefaultErrorBoundary
