import type { LoaderArgs } from "@remix-run/node"
import { type ActionArgs, redirect } from "@remix-run/node"
import { Form } from "@remix-run/react"
import Main from "~/components/elements/Main"
import { PageHeader } from "~/components/elements/PageHeader"
import { insertEntry } from "~/models/entry.server"
import Button from "~/components/elements/Button"
import { redirectIfUserLacksPermission } from "~/services/auth/session.server"

export async function action({ request }: ActionArgs) {
  const data = Object.fromEntries(await request.formData())
  insertEntry(data)
  return redirect(`/entries/${data.headword}`)
}

export async function loader({ request }: LoaderArgs) {
  await redirectIfUserLacksPermission(request, "det:createDraft")

  return {}
}

export default function Index() {
  return (
    <Main center={true}>
      <PageHeader>Insert entry</PageHeader>
      <p>Fill in the boxes to insert an entry into the database</p>
      <Form
        id="entryInsertionForm"
        className="flex flex-col justify-center pt-6 align-middle"
        method="post"
      >
        <div className="my-3 p-2">
          <label className="ml-3 pl-3 font-bold">
            Headword
            <input
              className="ml-3 border border-slate-400 pl-1"
              type="text"
              name="headword"
            />
          </label>
          <label className="ml-3 pl-3 font-bold">
            Spelling Variants
            <input
              className="ml-3 w-96 border border-slate-400 pl-1"
              type="text"
              name="spellingVariants"
            />
          </label>
        </div>

        <div className="my-3 p-2">
          <label className="ml-3 pl-3 font-bold">
            Etymology
            <input
              className="ml-3 border border-slate-400 pl-1"
              type="text"
              name="etymology"
            />
          </label>
          <label className="ml-3 pl-3 font-bold">
            General Labels
            <input
              className="ml-3 border border-slate-400 pl-1"
              type="text"
              name="generalLabels"
            />
          </label>
        </div>

        <div className="my-3 p-2">
          <label className="flex flex-col font-bold">
            Fistnote
            <textarea
              name="fistnote"
              className="h-28 w-1/2 border border-slate-400 p-1 font-normal"
            ></textarea>
          </label>
        </div>

        <div className="my-3 flex">
          <label className="ml-3 pl-3 font-bold">
            Dagger
            <input className="ml-3 pl-3" type="checkbox" name="dagger" />
          </label>
          <label className="ml-3 pl-3 font-bold">
            is Non Canadian
            <input className="ml-3 pl-3" type="checkbox" name="isNonCanadian" />
          </label>
        </div>

        <div className="my-3 flex justify-around">
          <label className="ml-3 pl-3 font-bold">
            Is Legacy
            <input
              className="ml-3 pl-3"
              type="radio"
              value="isLegacy"
              name="dchpVersion"
            />
          </label>
          <label className="ml-3 pl-3 font-bold">
            DCHP2
            <input
              className="ml-3 pl-3"
              type="radio"
              value="dchp2"
              name="dchpVersion"
            />
          </label>
          <label className="ml-3 pl-3 font-bold">
            DCHP3
            <input
              className="ml-3 pl-3"
              type="radio"
              value="dchp3"
              name="dchpVersion"
            />
          </label>
        </div>

        <Button className="mx-auto" type="submit" name="submitButton">
          Submit
        </Button>
      </Form>
    </Main>
  )
}
