import { attributeEnum } from "~/components/editing/attributeEnum"
import { useLoaderData } from "@remix-run/react"
import { getAttributeEnumFromFormInput } from "~/utils/generalUtils"
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
import EditEntry from "~/components/editing/entry/EditEntry"
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
  const type = getAttributeEnumFromFormInput(data.attributeType)

  const headword = params.headword
  await updateLogEntries(headword, request)

  console.log("=============")
  console.log(data)

  switch (type) {
    case attributeEnum.ENTRY:
      await updateEntry(data)
      break
    case attributeEnum.ADD_MEANING:
      await addMeaningToEntry(data)
      break
    case attributeEnum.MEANING:
      await updateMeaning(data)
      break
    case attributeEnum.DELETE_MEANING:
      await deleteMeaning(data)
      break
    case attributeEnum.QUOTATION:
      await addQuotations(data)
      break
    case attributeEnum.DELETE_QUOTATION:
      await deleteQuotations(data)
      break
    case attributeEnum.SEE_ALSO:
      await addSeeAlso(data)
      break
    case attributeEnum.DELETE_SEE_ALSO:
      await deleteSeeAlso(data)
      break
    case attributeEnum.DEFINITION_FIST_NOTE:
      await updateOrDeleteDefinitionFistNote(data)
      break
    case attributeEnum.ADD_DEFINITION_FIST_NOTE:
      await addDefinitionFistNote(data)
      break
    case attributeEnum.EDITING_TOOLS:
      await updateEditingTools(data)
      break
    case attributeEnum.EDITING_STATUS:
      await updateEditingStatus(data)
      break
    case attributeEnum.COMMENT:
      await updateEditingComment(data)
      break
    case attributeEnum.DELETE_IMAGE:
      await deleteImage(data)
      break
    // case attributeEnum.ADD_IMAGE:
    //   await addImage(data)
    //   break
    case attributeEnum.EDIT_IMAGE:
      await editImage(data)
      break
    default:
      throw new Error("attribute enum unknown")
  }

  // headword may have changed and data.headword exists-- so redirect
  if (type === attributeEnum.ENTRY) {
    return redirect(`/entries/${data.headword}/edit`)
  }

  return null
}

export default function EntryDetailsPage() {
  const { entry } = useLoaderData()

  return <EditEntry entry={entry} />
}

export const ErrorBoundary = DefaultErrorBoundary
