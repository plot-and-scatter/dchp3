import { Outlet } from "@remix-run/react"
import Header from "~/components/elements/Header"
import Main from "~/components/elements/Main"
import Nav from "~/components/elements/Nav"

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
