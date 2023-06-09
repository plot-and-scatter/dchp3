import { Form, useLoaderData } from "@remix-run/react"
import { type LoadedDataType } from "."
import { type LoaderArgs } from "@remix-run/server-runtime"
import invariant from "tiny-invariant"
import { getEntryByHeadword } from "~/models/entry.server"

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

  return (
    <div>
      <h1 className="text-2xl font-bold"> Update Entry</h1>
      <p>
        Edit fields below to update the entry: <b>{data.headword}</b>
      </p>
      <Form className="my-5" method="post">
        <div className="flex flex-col">
          <label className="">
            Headword
            <input
              className="mx-2 my-4 border p-1"
              value={data.headword}
            ></input>
          </label>
          <label className="">
            Alternatives
            <input
              className="mx-2 my-4 border p-1"
              value={"sample text"}
            ></input>
          </label>
          <label className="">
            Next Field
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
