import { Fragment } from "react"
import type {
  MetaFunction,
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "react-router"
import { DefaultErrorBoundary } from "~/components/elements/DefaultErrorBoundary"
import { getEntryByHeadword, updateLogEntries } from "~/models/entry.server"
import { handleEditFormAction } from "./handleEditFormAction"
import { redirectIfUserLacksEntryEditPermission } from "~/services/auth/session.server"
import { useLoaderData, useActionData, redirect, data } from "react-router"
import EntryEditor from "~/components/EntryEditor/EntryEditor"
import invariant from "tiny-invariant"
import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import { BASE_APP_TITLE } from "~/root"
import FormConflictBanner from "~/components/elements/Form/FormConflictBanner"
import { isHeadwordConflictError } from "~/services/errors/headwordConflict"

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  {
    title: `${BASE_APP_TITLE} | Editing ${
      data?.entry?.headword || "Entry not found"
    }`,
  },
]

export type EntryEditLoaderData = Awaited<Promise<ReturnType<typeof loader>>>

export async function action({ params, request }: ActionFunctionArgs) {
  invariant(params.headword, "No headword specified")

  const formData = await request.formData()

  const entryEditorFormAction = formData.get("entryEditorFormAction")

  // If we are deleting, we have to log an entry now, before the entry is
  // deleted
  if (entryEditorFormAction === EntryEditorFormActionEnum.DELETE_ENTRY) {
    await updateLogEntries(params.headword, request, entryEditorFormAction)
  }

  let submission
  try {
    submission = await handleEditFormAction(formData)
  } catch (error) {
    // Returned, not rethrown: the error boundary would replace the editor and
    // discard every other unsaved change on the page.
    if (isHeadwordConflictError(error)) {
      return data({ conflictMessage: error.message }, { status: 409 })
    }
    throw error
  }

  if (submission.status !== "success") {
    return data(submission.reply(), {
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

  return data(submission.reply())
}

export async function loader({ request, params }: LoaderFunctionArgs) {
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
  const { entry } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()

  return (
    <Fragment>
      <FormConflictBanner actionData={actionData} />
      <EntryEditor entry={entry} />
    </Fragment>
  )
}

export const ErrorBoundary = DefaultErrorBoundary
