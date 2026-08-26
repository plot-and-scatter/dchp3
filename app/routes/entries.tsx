import { Outlet } from "react-router"
import Main from "~/components/elements/Layouts/Main"

export default function EntriesPage() {
  return (
    <Main center={true}>
      <Outlet />
    </Main>
  )
}
