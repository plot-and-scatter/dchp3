import { NavLink, Outlet } from "@remix-run/react"
import type { LoaderArgs } from "@remix-run/server-runtime"
import { PageHeader } from "~/components/elements/PageHeader"
import { redirectIfUserNotLoggedIn } from "~/services/auth/session.server"

export const loader = async ({ request }: LoaderArgs) => {
  await redirectIfUserNotLoggedIn(request)

  return {}
}

export default function BankIndex() {
  return (
    <div className="p-12">
      <PageHeader>Bank of Canadian English</PageHeader>
      <nav className="bg-slate-100">
        <h2 className="my-8 text-xl font-bold">
          Links: <NavLink to="/bank/headword-list">Headword list</NavLink> •{" "}
          <NavLink to="/bank/create">New</NavLink> •{" "}
          <NavLink to="/bank/own">Show own</NavLink>
        </h2>
      </nav>
      <div>
        <Outlet />
      </div>
    </div>
  )
}
