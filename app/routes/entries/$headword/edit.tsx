import type { Prisma } from "@prisma/client"
import { redirect, type ActionArgs, type LoaderArgs } from "@remix-run/node"
import { Form, useCatch, useLoaderData } from "@remix-run/react"
import invariant from "tiny-invariant"

import { getEntryByHeadword } from "~/models/entry.server"
import {
  addDefinitionFistNote,
  addSeeAlso,
  deleteSeeAlso,
  updateCanadianism,
  updateOrDeleteDefinitionFistNote,
  updateEditingStatus,
  updateEditingTools,
  updateMeaningDefinition,
  updateMeaningHeader,
  updateRecordByAttributeAndType,
  addMeaningToEntry,
} from "~/models/update.server"

import Entry from "~/components/Entry"
import {
  getAttributeEnumFromFormInput,
  getStringFromFormInput,
} from "~/utils/generalUtils"
import { attributeEnum } from "~/components/editing/attributeEnum"
import { PageHeader } from "~/components/elements/PageHeader"
import React, { useState } from "react"
import Button from "~/components/elements/Button"

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
    case attributeEnum.ADD_MEANING:
      await addMeaningToEntry(data)
      break
    case attributeEnum.MEANING_HEADER:
      await updateMeaningHeader(data)
      break
    case attributeEnum.SEE_ALSO:
      await addSeeAlso(data)
      break
    case attributeEnum.DELETE_SEE_ALSO:
      await deleteSeeAlso(data)
      break
    case attributeEnum.CANADIANISM:
      await updateCanadianism(data)
      break
    case attributeEnum.DEFINITION:
      await updateMeaningDefinition(data)
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

interface editHeadwordInputProps {
  label: string
  value: string
  name: string
  type?: "input" | "textarea"
  onChangeFunction: React.SetStateAction<any>
  className?: string
}

export function EditHeadwordInput({
  label,
  value,
  name,
  type,
  onChangeFunction,
  className,
}: editHeadwordInputProps) {
  let inputElm =
    type === "textarea" ? (
      <textarea
        value={value}
        name={name}
        onChange={(e) => onChangeFunction(e.target.value)}
        className="m-1 w-full border p-1"
      ></textarea>
    ) : (
      <input
        value={value}
        name={name}
        onChange={(e) => onChangeFunction(e.target.value)}
        className="m-1 border p-1"
      />
    )

  return (
    <div className={className}>
      <label htmlFor={name} className="m-2">
        {label}
      </label>
      {inputElm}
    </div>
  )
}

export default function EntryDetailsPage() {
  const data = useLoaderData<typeof loader>() as LoadedDataType
  const id = data.id
  const [headword, setHeadword] = useState(data.headword)
  const [spellingVariant, setSpellingVariant] = useState(
    data.spelling_variants || ""
  )
  const [generalLabels, setGeneralLabels] = useState(data.general_labels || "")
  const [handNote, setHandnote] = useState(data.fist_note || "")
  const [dagger, setDagger] = useState(data.dagger)
  const [etymology, setEtymology] = useState(data.etymology || "")
  const [isLegacy, setIsLegacy] = useState(data.is_legacy)
  const [isNonCanadian, setIsNonCanadian] = useState(data.no_cdn_conf)

  return (
    <div className="w-3/4">
      <PageHeader>Edit Headword: {data.headword}</PageHeader>
      <Form>
        <div className="grid grid-cols-6">
          <EditHeadwordInput
            label="headword: "
            name="headword"
            value={headword}
            onChangeFunction={setHeadword}
            className="col-span-2"
          />
          <EditHeadwordInput
            label="Spelling Variants: "
            name="spellingVariant"
            value={spellingVariant}
            onChangeFunction={setSpellingVariant}
            className="col-span-2"
          />
          <EditHeadwordInput
            label="General Labels: "
            name="generalLabels"
            value={generalLabels}
            onChangeFunction={setGeneralLabels}
            className="col-span-2"
          />
          <EditHeadwordInput
            label="Etymology: "
            name="etymology"
            value={etymology}
            onChangeFunction={setEtymology}
            className="col-span-2"
          />
          <label className="col-span-1 m-2">
            Dagger
            <input
              name="dagger"
              checked={dagger}
              onChange={(e) => setDagger(e.target.checked)}
              type="checkBox"
              className="mx-3 border p-1"
            />
          </label>
          <label className="col-span-1 m-2">
            Legacy:
            <input
              name="isLegacy"
              checked={isLegacy}
              onChange={(e) => setIsLegacy(e.target.checked)}
              type="checkBox"
              className="mx-3 border p-1"
            />
          </label>
          <label className="col-span-1 m-2">
            Non Canadian:
            <input
              name="isNonCanadian"
              checked={isNonCanadian}
              onChange={(e) => setIsNonCanadian(e.target.checked)}
              type="checkBox"
              className="mx-3 border p-1"
            />
          </label>
          <EditHeadwordInput
            label="Fist Note: "
            name="fistNote"
            value={handNote}
            type="textarea"
            onChangeFunction={setHandnote}
            className="col-span-6 my-4"
          />
          <Button
            className="col-span-2 col-start-3"
            type="submit"
            size="medium"
          >
            Submit
          </Button>
        </div>
      </Form>
    </div>
  )
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
