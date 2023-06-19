import { Outlet } from "@remix-run/react"
import { redirect } from "@remix-run/server-runtime"
import Header from "~/components/elements/Header"
import Main from "~/components/elements/Main"
import Nav from "~/components/elements/Nav"

export async function action() {
  return redirect(`http://localhost:3000/entries/browse/E/1`)
}

export default function EntriesPage() {
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
