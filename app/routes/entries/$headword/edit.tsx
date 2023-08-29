import { redirect, type ActionArgs, type LoaderArgs } from "@remix-run/node"
import { Form, useCatch, useLoaderData } from "@remix-run/react"
import invariant from "tiny-invariant"
import { getEntryByHeadword, updateEntry } from "~/models/entry.server"
import { getAttributeEnumFromFormInput } from "~/utils/generalUtils"
import { attributeEnum } from "~/components/editing/attributeEnum"
import { PageHeader } from "~/components/elements/PageHeader"
import React, { useState } from "react"
import Button from "~/components/elements/Button"
import MeaningEditingForm from "./MeaningEditingForm"
import { type LoadedDataType } from "."
import { updateMeaning } from "~/models/update.server"

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
    case attributeEnum.MEANING:
      await updateMeaning(data)
      break
    default:
      throw new Error("attribute enum unknown")
  }

  return redirect(`/entries/${data.headword}`)
}

interface editHeadwordInputProps {
  label: string
  value: string
  name: string
  type?: "input" | "textarea" | "dropdown"
  onChangeFunction: React.SetStateAction<any>
  className?: string
}

export function EditFormInput(props: editHeadwordInputProps) {
  let inputElm = getEditFormInput(props)
  let { className, name, label } = props

  return (
    <div className={className}>
      <label htmlFor={name} className="m-2">
        {label}
      </label>
      {inputElm}
    </div>
  )
}

function getEditFormInput({
  value,
  name,
  type,
  onChangeFunction,
}: editHeadwordInputProps) {
  switch (type) {
    case "textarea":
      return (
        <textarea
          value={value}
          name={name}
          onChange={(e) => onChangeFunction(e.target.value)}
          className="m-1 h-24 w-full border p-1"
        ></textarea>
      )
    default:
      return (
        <input
          value={value}
          name={name}
          type={type}
          onChange={(e) => onChangeFunction(e.target.value)}
          className="m-1 border p-1"
        />
      )
  }
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
      <Form method="post">
        <div className="grid grid-cols-6">
          <input type="hidden" name="id" value={id} />
          <input
            type="hidden"
            name="attributeType"
            value={attributeEnum.ENTRY}
          />
          <EditFormInput
            label="headword: "
            name="headword"
            value={headword}
            onChangeFunction={setHeadword}
            className="col-span-2"
          />
          <EditFormInput
            label="Spelling Variants: "
            name="spellingVariant"
            value={spellingVariant}
            onChangeFunction={setSpellingVariant}
            className="col-span-2"
          />
          <EditFormInput
            label="General Labels: "
            name="generalLabels"
            value={generalLabels}
            onChangeFunction={setGeneralLabels}
            className="col-span-2"
          />
          <EditFormInput
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
          <EditFormInput
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
      <div id="definitions">
        {data.meanings
          .sort((a, b) => (a.order || "").localeCompare(b.order || ""))
          .map((meaning) => (
            <MeaningEditingForm
              key={meaning.id}
              headword={headword}
              meaning={meaning}
            />
          ))}
      </div>
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
    return <div>Error</div>
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`)
}
