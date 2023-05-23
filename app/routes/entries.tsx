import type { LoaderArgs } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Outlet } from "@remix-run/react"
import Header from "~/components/elements/Header"
import Main from "~/components/elements/Main"
import Nav from "~/components/elements/Nav"

import { getEntries } from "~/models/entry.server"

export async function loader({ request }: LoaderArgs) {
  const entries = await getEntries()
  return json({ entries })
}

export default function EntriesPage() {
  // const data = useLoaderData<typeof loader>();

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
