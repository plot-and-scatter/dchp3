import { type ActionArgs, redirect } from "@remix-run/node"
import { Form } from "@remix-run/react"
import Header from "~/components/elements/Header"
import Main from "~/components/elements/Main"
import Nav from "~/components/elements/Nav"
import { insertEntry } from "~/models/entry.server"
import Button from "~/components/elements/Button"

export async function action({ request }: ActionArgs) {
  const data = Object.fromEntries(await request.formData())
  console.log(data)
  insertEntry(data)
  return redirect(`/entries/${data.headword}`)
}

export default function Index() {
  return (
    <div className="relative">
      <Header />
      <Nav />
      <Main>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Insert entry</h1>
          <p>Fill in the boxes to insert an entry into the database</p>
          <Form
            id="entryInsertionForm"
            className="flex flex-col justify-center pt-6 align-middle"
            method="post"
          >
            <div className="my-3 p-2">
              <label className="font-bold">
                ID
                <input
                  className="ml-3 border border-slate-400 pl-1"
                  type="number"
                  name="id"
                />
              </label>
              <label className="ml-3 pl-3 font-bold">
                Headword
                <input
                  className="ml-3 border border-slate-400 pl-1"
                  type="text"
                  name="headword"
                />
              </label>
            </div>

            <div className="my-3 flex justify-around">
              <label className="ml-3 pl-3 font-bold">
                First Radio
                <input
                  className="ml-3 pl-3"
                  type="radio"
                  value="firstRadio"
                  name="testRadio"
                />
              </label>
              <label className="ml-3 pl-3 font-bold">
                Second Radio
                <input
                  className="ml-3 pl-3"
                  type="radio"
                  value="secondRadio"
                  name="testRadio"
                />
              </label>
              <label className="ml-3 pl-3 font-bold">
                Third Radio
                <input
                  className="ml-3 pl-3"
                  type="radio"
                  value="thirdRadio"
                  name="testRadio"
                />
              </label>
            </div>

            <div className="my-3 flex justify-around">
              <label className="ml-3 pl-3 font-bold">
                First Checkbox
                <input
                  className="ml-3 pl-3"
                  type="checkbox"
                  value="firstCheckbox"
                  name="testFirstCheckbox"
                />
              </label>
              <label className="ml-3 pl-3 font-bold">
                Second Checkbox
                <input
                  className="ml-3 pl-3"
                  type="checkbox"
                  value="secondCheckbox"
                  name="testSecondCheckbox"
                />
              </label>
              <label className="ml-3 pl-3 font-bold">
                Third Checkbox
                <input
                  className="ml-3 pl-3"
                  type="checkbox"
                  value="thirdCheckbox"
                  name="testThirdCheckbox"
                />
              </label>
            </div>

            <div className="my-3 flex justify-around">
              <label className="ml-3 pl-3 font-bold">
                Dropdown
                <select
                  className="ml-3 border border-slate-400 pl-3 font-normal"
                  name="testDropdown"
                >
                  <option value="firstOption">first</option>
                  <option value="secondOption">second</option>
                  <option value="thirdOption">third</option>
                  <option value="fourthOption">fourth</option>
                </select>
              </label>
            </div>

            <div className="my-3 p-2">
              <label className="flex flex-col font-bold">
                Large Amount Of Text
                <textarea
                  name="testTextArea"
                  className="h-28 border border-slate-400 p-1 font-normal"
                >
                  this is a lot of text
                </textarea>
              </label>
            </div>

            <Button className={"mx-auto my-4 w-24 border border-slate-600 bg-slate-500 p-2 text-white hover:bg-slate-400"} type="submit" name="submitButton">
              Submit
            </Button>
          </Form>
        </div>
      </Main>
    </div>
  )
}
