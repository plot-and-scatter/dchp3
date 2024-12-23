import { DefaultErrorBoundary } from "~/components/elements/DefaultErrorBoundary"
import { getEntryByHeadword, updateLogEntries } from "~/models/entry.server"
import { handleEditFormAction } from "./handleEditFormAction"
import { redirectIfUserLacksEntryEditPermission } from "~/services/auth/session.server"
import { useLoaderData } from "@remix-run/react"
import EntryEditor from "~/components/EntryEditor/EntryEditor"
import invariant from "tiny-invariant"
import { redirect, json } from "@remix-run/node"
import type {
  MetaFunction,
  SerializeFrom,
  ActionArgs,
  LoaderArgs,
} from "@remix-run/node"
import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import { BASE_APP_TITLE } from "~/root"

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return {
    title: `${BASE_APP_TITLE} | Editing ${
      data?.entry?.headword || "Entry not found"
    }`,
  }
}

export type EntryEditLoaderData = SerializeFrom<
  Awaited<Promise<ReturnType<typeof loader>>>
>

export async function action({ params, request }: ActionArgs) {
  invariant(params.headword, "No headword specified")

  const formData = await request.formData()

  const entryEditorFormAction = formData.get("entryEditorFormAction")

  // If we are deleting, we have to log an entry now, before the entry is
  // deleted
  if (entryEditorFormAction === EntryEditorFormActionEnum.DELETE_ENTRY) {
    await updateLogEntries(params.headword, request, entryEditorFormAction)
  }

  const submission = await handleEditFormAction(formData)

  if (submission.status !== "success") {
    return json(submission.reply(), {
      status: submission.status === "error" ? 400 : 200,
    })
  }

  const headword = params.headword

  // Headword may have changed and data.headword exists; redirect if so
  if (
    submission.value.entryEditorFormAction ===
    EntryEditorFormActionEnum.UPDATE_ENTRY
  ) {
    await updateLogEntries(
      submission.value.headword,
      request,
      submission.value.entryEditorFormAction
    )
    return redirect(`/entries/${submission.value.headword}/edit`)
  }

  // We may have deleted the entry; redirect to "insert entry" page (note, we
  // updated the log entries above, so we don't need to do it again here)
  if (
    submission.value.entryEditorFormAction ===
    EntryEditorFormActionEnum.DELETE_ENTRY
  ) {
    return redirect(`/insertEntry`)
  }

  await updateLogEntries(
    headword,
    request,
    submission.value.entryEditorFormAction
  )

  return json(submission.reply())
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
