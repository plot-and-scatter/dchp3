import { Form, useLoaderData } from "@remix-run/react"
import { type LoadedDataType } from "."
import { type ActionArgs, type LoaderArgs } from "@remix-run/server-runtime"
import invariant from "tiny-invariant"
import {
  getEntryByHeadword,
  updateEntryByHeadword,
} from "~/models/entry.server"
import { useState } from "react"

export async function action({ params, request }: ActionArgs) {
  invariant(params.headword, "headword for update not found")
  const data = Object.fromEntries(await request.formData())
  updateEntryByHeadword(params.headword, data.newHeadword.toString())

  return null
}

export async function loader({ params }: LoaderArgs) {
  invariant(params.headword, "headword not found")

  const entry = await getEntryByHeadword({ headword: params.headword })
  if (!entry) {
    throw new Response("Not Found", { status: 404 })
  }
  return entry
}

export default function EditEntryPage() {
  const data = useLoaderData<typeof loader>() as LoadedDataType
  const [headword, setHeadword] = useState(data.headword)
  const [alternatives, setAlternatives] = useState(data.spelling_variants)

  return (
    <div>
      <h1 className="text-2xl font-bold"> Update Entry</h1>
      <p>
        Edit fields below to update the entry: <b>{data.headword}</b>
      </p>
      <Form className="my-5" method="post">
        <div className="flex flex-col">
          <label>
            Headword
            <input
              className="mx-2 my-4 border p-1"
              value={headword}
              name="newHeadword"
              onChange={(e) => setHeadword(e.target.value)}
            ></input>
          </label>
          <label>
            Alternatives
            <input
              className="mx-2 my-4 border p-1"
              value={alternatives ? alternatives : ""}
              onChange={(e) => setAlternatives(e.target.value)}
            ></input>
          </label>
          <label>
            Sample Field
            <input
              className="mx-2 my-4 border p-1"
              value={"sample text"}
            ></input>
          </label>
          <button
            className="mt-5 border border-slate-600 bg-slate-500 p-1 text-white hover:bg-slate-400"
            type="submit"
          >
            Update Entry
          </button>
        </div>
      </Form>
    </div>
  )
}
