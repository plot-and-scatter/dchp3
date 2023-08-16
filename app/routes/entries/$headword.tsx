import type { Prisma } from "@prisma/client"
import { redirect, type ActionArgs, type LoaderArgs } from "@remix-run/node"
import { useCatch, useLoaderData } from "@remix-run/react"
import invariant from "tiny-invariant"

import { getEntryByHeadword } from "~/models/entry.server"
import {
  addDefinitionFistNote,
  addSeeAlso,
  updateCanadianism,
  updateDefinitionFistNote,
  updateEditingStatus,
  updateEditingTools,
  updateMeaningDefinition,
  updateMeaningHeader,
  updateRecordByAttributeAndType,
} from "~/models/update.server"

import Entry from "~/components/Entry"
import {
  getAttributeEnumFromFormInput,
  getStringFromFormInput,
} from "~/utils/generalUtils"
import { attributeEnum } from "~/components/editing/attributeEnum"

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
    case attributeEnum.MEANING_HEADER:
      await updateMeaningHeader(data)
      break
    case attributeEnum.SEE_ALSO:
      await addSeeAlso(data)
      break
    case attributeEnum.CANADIANISM:
      await updateCanadianism(data)
      break
    case attributeEnum.DEFINITION:
      await updateMeaningDefinition(data)
      break
    case attributeEnum.DEFINITION_FIST_NOTE:
      await updateDefinitionFistNote(data)
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
      await updateRecordByAttributeAndType(type, data)
      break
  }

  // old headword invalid-- redirect to updated headword
  if (type === attributeEnum.HEADWORD) {
    const headword = getStringFromFormInput(data.newValue)
    return redirect(`/entries/${headword}`)
  }

  return null
}

export type LoadedDataType = Prisma.PromiseReturnType<typeof loader>

export default function EntryDetailsPage() {
  const data = useLoaderData<typeof loader>() as LoadedDataType

  return <Entry data={data} />
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error)

  return <div>An unexpected error occurred: {error.message}</div>
}

export function CatchBoundary() {
  const caught = useCatch()

  if (caught.status === 404) {
    return <div>Entry not found</div>
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`)
}
