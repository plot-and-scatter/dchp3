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

export default function EntriesPage() {
  const data = useLoaderData<typeof loader>();

  /*
  {data.entries.map((e) => {
        return (<p className="relative mt-20 bg-white p-3 md:mx-auto md:mt-36 md:flex md:flex-row md:justify-center">
          {e.headword}
        </p>);
      })}
  */

  return (
    <div className="relative">
      <Header />
      <Nav />
      <Main>
        <Outlet />
      </Main>
    </div>
  )
}
