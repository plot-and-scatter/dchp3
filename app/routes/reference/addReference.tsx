import { Form } from "@remix-run/react"
import { type ActionArgs, redirect } from "@remix-run/server-runtime"
import invariant from "tiny-invariant"
import { addReference } from "~/models/reference.server"
import { getStringFromFormInput } from "~/utils/generalUtils"

export async function action({ request, params }: ActionArgs) {
  const data = Object.fromEntries(await request.formData())
  invariant(data.shortDisplay)
  invariant(data.referenceText)

  const shortDisplay = getStringFromFormInput(data.shortDisplay)
  const referenceText = getStringFromFormInput(data.referenceText)

  addReference(shortDisplay, referenceText)
  return redirect(`/reference`)
}

export default function ReferenceIdPage() {
  return (
    <div className="flex w-full max-w-4xl flex-col">
      <h2 className="text-2xl font-bold"> Reference Adder </h2>
      <Form className="flex flex-col" method="post">
        <input type="hidden" name="id" />
        <label>
          Short Display Text:
          <input name="shortDisplay" className="m-3 border-2 p-1" type="text" />
        </label>
        <label className="flex flex-col">
          <p>Reference Text:</p>
          <textarea name="referenceText" className="my-1 border-2 p-2" />
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
