import { ActionArgs, ActionFunction, LoaderArgs, redirect } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Form, Outlet, useLoaderData } from "@remix-run/react"
import Header from "~/components/elements/Header"
import Main from "~/components/elements/Main"
import Nav from "~/components/elements/Nav"

import { getEntries, putEntries } from "~/models/entry.server"

export async function loader({ request }: LoaderArgs) {
  const entries = await getEntries()
  return json({ entries })
}

export async function action({ request }: ActionArgs) {
  const data = Object.fromEntries(await request.formData());
  putEntries(data);
  return redirect(`/entries/${data.inputBox}`);
}

export default function EntriesPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="relative">
      <Header />
      <Nav />
      <Main>
        <Outlet />
      </Main>
      <Form id="newForm" className=" bg-gray-400 relative mt-20 p-3 md:mx-auto md:mt-36 md:flex md:flex-col md:justify-center" method="post">
        <label className="p-3">
          insert data
          <input className="m-3" type="text" name="inputBox" />
        </label>
        <label className="p-3">
          insert more data
          <input className="m-3" type="text" name="inputBox2" />
        </label>
        <button className="bg-white" type="submit" name="submitButton">
          Submit
        </button>
      </Form>

      {data.entries.map((e) => {
        return (<p className="relative mt-20 bg-white p-3 md:mx-auto md:mt-36 md:flex md:flex-row md:justify-center">
          {e.headword}
        </p>);
      })}

    </div>
  )
}
