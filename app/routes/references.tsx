import { Outlet } from "@remix-run/react"
import Main from "~/components/elements/Main"

export default function References() {
  return (
    <Main>
      <Outlet />
    </Main>
  )
}
