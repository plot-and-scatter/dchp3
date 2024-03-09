import { Outlet } from "@remix-run/react"
import Main from "~/components/elements/Main"
import { PageHeader } from "~/components/elements/Headings/PageHeader"

export default function References() {
  return (
    <Main>
      <PageHeader>References</PageHeader>
      <Outlet />
    </Main>
  )
}
