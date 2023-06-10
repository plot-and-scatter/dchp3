import { Form } from "@remix-run/react"
import { type ActionArgs } from "@remix-run/server-runtime"
import invariant from "tiny-invariant"
import { updateEntryByHeadword } from "~/models/entry.server"

interface EntryProps {
  headword: string
}

export async function action({ params, request }: ActionArgs) {
  invariant(params.headword)
  const data = Object.fromEntries(await request.formData())
  console.log("action running on: " + params.headword)
  console.log("updating headword to: " + data.headword)
  updateEntryByHeadword(params.headword)

  return null
}

const UpdateEntryForm = ({ headword }: EntryProps): JSX.Element => {
  return (
    <div>
      <h1 className="text-2xl font-bold"> Update Entry</h1>
      <p>
        Edit fields below to update the entry: <b>{headword}</b>
      </p>
      <Form className="my-5" method="post">
        <div className="flex flex-col">
          <label className="">
            Headword
            <input
              className="mx-2 my-4 border p-1"
              value={headword}
              name="headword"
            ></input>
          </label>
          <label className="">
            Alternatives
            <input
              type="text"
              className="mx-2 my-4 border p-1"
              value="sample text"
            ></input>
          </label>
          <label className="">
            Next Field
            <input
              type="text"
              className="mx-2 my-4 border p-1"
              value="sample text"
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

export default UpdateEntryForm
