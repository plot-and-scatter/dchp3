import { Outlet } from "@remix-run/react"
import Main from "~/components/elements/Main"

export default function EntriesPage() {
  return (
    <Main align="center">
      <Outlet />
    </Main>
  )
}
