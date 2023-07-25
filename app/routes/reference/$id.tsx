import { Form, useLoaderData } from "@remix-run/react"
import {
  type ActionArgs,
  redirect,
  type LoaderArgs,
} from "@remix-run/server-runtime"
import { useState } from "react"
import invariant from "tiny-invariant"
import {
  type det_references,
  getReferenceById,
  updateReferenceById,
} from "~/models/reference.server"
import {
  getNumberFromFormInput,
  getStringFromFormInput,
} from "~/utils/generalUtils"

export async function loader({ params }: LoaderArgs) {
  invariant(params.id)
  const id: number = parseInt(params.id)
  const data: det_references | null = await getReferenceById(id)
  if (!data) throw new Error(`Reference with id: ${id} could not be obtained`)

  return data
}

export async function action({ request, params }: ActionArgs) {
  const data = Object.fromEntries(await request.formData())
  invariant(data.id)
  invariant(data.shortDisplay)
  invariant(data.referenceText)

  const id = getNumberFromFormInput(data.id)
  const shortDisplay = getStringFromFormInput(data.shortDisplay)
  const referenceText = getStringFromFormInput(data.referenceText)

  console.log(id)
  console.log(shortDisplay)
  console.log(referenceText)

  updateReferenceById(id, shortDisplay, referenceText)
  return redirect(`/reference`)
}

export default function ReferenceIdPage() {
  const data = useLoaderData<typeof loader>()
  let [shortDisplay, setShortDisplay] = useState(data.short_display)
  let [referenceText, setReferenceText] = useState(data.reference_text)

  return (
    <div className="flex w-full max-w-4xl flex-col">
      <h2 className="text-2xl font-bold"> Reference Editor </h2>
      <Form className="flex flex-col" method="post">
        <input type="hidden" name="id" value={data.id} />
        <label>
          Short Display Text:
          <input
            name="shortDisplay"
            value={shortDisplay}
            onChange={(e) => {
              setShortDisplay(e.target.value)
            }}
            className="m-3 border-2 p-1"
            type="text"
          />
        </label>
        <label className="flex flex-col">
          <p>Reference Text:</p>
          <textarea
            name="referenceText"
            value={referenceText}
            onChange={(e) => {
              setReferenceText(e.target.value)
            }}
            className="my-1 border-2 p-2"
          />
        </label>
        <div className="flex w-full flex-row justify-around self-center">
          <button type="submit" name="updateReference">
            Submit Changes
          </button>
          <button type="submit" name="deleteReference">
            Delete Reference
          </button>
        </div>
      </Form>
    </div>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error)

  return <div>An unexpected error occurred: {error.message}</div>
}
