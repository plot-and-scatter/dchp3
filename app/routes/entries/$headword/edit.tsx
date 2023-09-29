import { attributeEnum } from "~/components/editing/attributeEnum"
import { useLoaderData } from "@remix-run/react"
import { getAttributeEnumFromFormInput } from "~/utils/generalUtils"
import { getEntryByHeadword, updateEntry } from "~/models/entry.server"
import { redirect, type ActionArgs, type LoaderArgs } from "@remix-run/node"
import invariant from "tiny-invariant"
import {
  addDefinitionFistNote,
  addMeaningToEntry,
  addQuotations,
  addSeeAlso,
  deleteMeaning,
  deleteQuotations,
  deleteSeeAlso,
  updateEditingStatus,
  updateEditingTools,
  updateMeaning,
  updateOrDeleteDefinitionFistNote,
} from "~/models/update.server"
import { DefaultErrorBoundary } from "~/components/elements/DefaultErrorBoundary"
import EditEntry from "~/components/editing/entry/EditEntry"

export async function loader({ params }: LoaderArgs) {
  invariant(params.headword, "headword not found")

  const entry = await getEntryByHeadword({ headword: params.headword })

  if (!entry) {
    throw new Response("Not Found", { status: 404 })
  }

  return { entry }
}

export type EntryEditLoaderData = Awaited<Promise<ReturnType<typeof loader>>>

export async function action({ request }: ActionArgs) {
  const data = Object.fromEntries(await request.formData())
  const type = getAttributeEnumFromFormInput(data.attributeType)

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
