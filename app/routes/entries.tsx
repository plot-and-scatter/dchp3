import { Outlet } from "@remix-run/react"
import Main from "~/components/elements/Layouts/Main"

export default function EntriesPage() {
  return (
    <Main center={true}>
      <Outlet />
    </Main>
  )
}
