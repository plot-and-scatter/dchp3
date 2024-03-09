import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import { useLoaderData } from "@remix-run/react"
import { getEntryEditorFormAction } from "~/utils/generalUtils"
import {
  getEntryByHeadword,
  updateEntry,
  updateLogEntries,
} from "~/models/entry.server"
import { redirect } from "@remix-run/node"
import type { SerializeFrom, ActionArgs, LoaderArgs } from "@remix-run/node"
import invariant from "tiny-invariant"
import {
  addDefinitionFistNote,
  addMeaningToEntry,
  addQuotations,
  addSeeAlso,
  deleteImage,
  deleteMeaning,
  deleteQuotations,
  deleteSeeAlso,
  editImage,
  updateEditingComment,
  updateEditingStatus,
  updateEditingTools,
  updateMeaning,
  updateOrDeleteDefinitionFistNote,
} from "~/models/update.server"
import { DefaultErrorBoundary } from "~/components/elements/DefaultErrorBoundary"
import EntryEditor from "~/components/EntryEditor/EntryEditor"
import {
  redirectIfUserLacksPermission,
  userHasPermission,
} from "~/services/auth/session.server"
import { redirectIfUserLacksEntry } from "~/models/user.server"

async function redirectIfUserLacksEditPermission(
  request: Request,
  headword: string
) {
  if (await userHasPermission(request, "det:editAny")) {
    return
  }

  await redirectIfUserLacksPermission(request, "det:editOwn")
  await redirectIfUserLacksEntry(request, headword)
}

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.headword, "headword not found")
  await redirectIfUserLacksEditPermission(request, params.headword)

  const entry = await getEntryByHeadword({ headword: params.headword })

  if (!entry) {
    throw new Response("Not Found", { status: 404 })
  }

  // Rewrite image URLs
  // TODO: Factor this out into a function
  entry.images.forEach((i) =>
    i.path
      ? (i.path = `${process.env.IMAGE_BUCKET_PREFIX}${i.path}`)
      : undefined
  )

  return { entry }
}

export type EntryEditLoaderData = SerializeFrom<
  Awaited<Promise<ReturnType<typeof loader>>>
>

export async function action({ params, request }: ActionArgs) {
  invariant(params.headword)
  const data = Object.fromEntries(await request.formData())
  const entryEditorFormAction = getEntryEditorFormAction(
    data.entryEditorFormAction
  )

  const headword = params.headword
  await updateLogEntries(headword, request)

  switch (entryEditorFormAction) {
    case EntryEditorFormActionEnum.ENTRY:
      await updateEntry(data)
      break
    case EntryEditorFormActionEnum.ADD_MEANING:
      await addMeaningToEntry(data)
      break
    case EntryEditorFormActionEnum.MEANING:
      await updateMeaning(data)
      break
    case EntryEditorFormActionEnum.DELETE_MEANING:
      await deleteMeaning(data)
      break
    case EntryEditorFormActionEnum.QUOTATION:
      await addQuotations(data)
      break
    case EntryEditorFormActionEnum.DELETE_QUOTATION:
      await deleteQuotations(data)
      break
    case EntryEditorFormActionEnum.SEE_ALSO:
      await addSeeAlso(data)
      break
    case EntryEditorFormActionEnum.DELETE_SEE_ALSO:
      await deleteSeeAlso(data)
      break
    case EntryEditorFormActionEnum.DEFINITION_FIST_NOTE:
      await updateOrDeleteDefinitionFistNote(data)
      break
    case EntryEditorFormActionEnum.ADD_DEFINITION_FIST_NOTE:
      await addDefinitionFistNote(data)
      break
    case EntryEditorFormActionEnum.EDITING_TOOLS:
      await updateEditingTools(data)
      break
    case EntryEditorFormActionEnum.EDITING_STATUS:
      await updateEditingStatus(data)
      break
    case EntryEditorFormActionEnum.COMMENT:
      await updateEditingComment(data)
      break
    case EntryEditorFormActionEnum.DELETE_IMAGE:
      await deleteImage(data)
      break
    // case attributeEnum.ADD_IMAGE:
    //   await addImage(data)
    //   break
    case EntryEditorFormActionEnum.EDIT_IMAGE:
      await editImage(data)
      break
    default:
      throw new Error(`Unknown entryEditorFormAction ${entryEditorFormAction}`)
  }

  // headword may have changed and data.headword exists -- so redirect
  if (entryEditorFormAction === EntryEditorFormActionEnum.ENTRY) {
    return redirect(`/entries/${data.headword}/edit`)
  }

  return null
}

export default function EntryDetailsPage() {
  const { entry } = useLoaderData()

  return <EntryEditor entry={entry} />
}

export const ErrorBoundary = DefaultErrorBoundary
