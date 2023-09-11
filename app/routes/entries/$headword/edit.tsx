import { attributeEnum } from "~/components/editing/attributeEnum"
import { Form, Link, useLoaderData } from "@remix-run/react"
import { getAttributeEnumFromFormInput } from "~/utils/generalUtils"
import { getEntryByHeadword, updateEntry } from "~/models/entry.server"
import { PageHeader } from "~/components/elements/PageHeader"
import { redirect, type ActionArgs, type LoaderArgs } from "@remix-run/node"
import { type LoadedDataType } from "."
import Button from "~/components/elements/Button"
import invariant from "tiny-invariant"
import {
  addDefinitionFistNote,
  addMeaningToEntry,
  addSeeAlso,
  deleteMeaning,
  deleteSeeAlso,
  updateEditingStatus,
  updateEditingTools,
  updateMeaning,
  updateOrDeleteDefinitionFistNote,
} from "~/models/update.server"
import { DefaultErrorBoundary } from "~/components/elements/DefaultErrorBoundary"
import EditingStatus from "~/components/editing/EditingStatus"
import EditingTools from "~/components/editing/EditingTools"
import EntryEditingForm from "./edit/EntryEditingForm"
import MeaningEditingForms from "./edit/MeaningEditingForms"

export async function loader({ params }: LoaderArgs) {
  invariant(params.headword, "headword not found")

  const entry = await getEntryByHeadword({ headword: params.headword })
  if (!entry) {
    throw new Response("Not Found", { status: 404 })
  }
  return entry
}

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
  const data = useLoaderData<typeof loader>() as LoadedDataType
  const id = data.id
  const headword = data.headword

  return (
    <div className="flex w-11/12 flex-row justify-between">
      <div className="w-1/4 align-bottom">
        <div className="fixed mt-10">
          <Link
            to={`/entries/${headword}`}
            className="h-fit rounded border border-slate-700 bg-slate-600 p-2 text-white transition-colors duration-300 hover:bg-slate-500"
          >
            Return To Headword
          </Link>
          <Form
            reloadDocument={true}
            action={`/entries/${headword}/edit`}
            method="post"
            className="my-5"
          >
            <Button>Add New Meaning</Button>
            <input
              type="hidden"
              name="attributeType"
              value={attributeEnum.ADD_MEANING}
            />
            <input type="hidden" name="attributeID" value={id} />
            <input type="hidden" name="headword" value={headword} />
          </Form>
          <EditingTools data={data} />
          <EditingStatus data={data} />
        </div>
      </div>

      <div className="w-3/4">
        <div className="flex flex-row items-center justify-between">
          <PageHeader>Edit Headword: {headword}</PageHeader>
        </div>
        <EntryEditingForm data={data} />
        <MeaningEditingForms data={data} />
      </div>
    </div>
  )
}

export const ErrorBoundary = DefaultErrorBoundary
