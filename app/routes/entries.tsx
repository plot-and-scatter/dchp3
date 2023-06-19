import { Outlet } from "@remix-run/react"
import { type ActionArgs } from "@remix-run/server-runtime"
import Header from "~/components/elements/Header"
import Main from "~/components/elements/Main"
import Nav from "~/components/elements/Nav"

export async function action({ request }: ActionArgs) {
  const data = Object.fromEntries(await request.formData())
  console.log(data)
  return null
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
