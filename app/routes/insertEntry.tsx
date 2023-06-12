import { type ActionArgs, redirect } from "@remix-run/node"
import { Form } from "@remix-run/react"
import Header from "~/components/elements/Header"
import Main from "~/components/elements/Main"
import Nav from "~/components/elements/Nav"
import { insertEntry } from "~/models/entry.server"

export async function action({ request }: ActionArgs) {
  const data = Object.fromEntries(await request.formData())
  insertEntry(data)
  return redirect(`/entries/${data.headword}`)
}

export default function Index() {
  return (
    <div className="relative">
      <Header />
      <Nav />
      <Main>
        <p>Insert Entry</p>
      </Main>
      <Form
        id="newForm"
        className=" md:mt-18 relative mt-10 bg-gray-400 p-3 md:mx-auto md:flex md:flex-col md:justify-center"
        method="post"
      >
        <label className="p-3">
          ID
          <input className="m-3" type="text" name="id" />
        </label>
        <label className="p-3">
          Headword
          <input className="m-3" type="text" name="headword" />
        </label>
        <button className="bg-white" type="submit" name="submitButton">
          Submit
        </button>
      </Form>
    </div>
  )
}
