import { NavLink, Outlet } from "@remix-run/react"
import type { LoaderArgs } from "@remix-run/server-runtime"
import { PageHeader } from "~/components/elements/PageHeader"
import { redirectIfUserNotLoggedIn } from "~/services/auth/session.server"

export const loader = async ({ request }: LoaderArgs) => {
  // TODO: Restore.
  // await redirectIfUserNotLoggedIn(request)

  return {}
}

export default function BankIndex() {
  return (
    <div className="p-12">
      <PageHeader>Bank of Canadian English</PageHeader>
      <nav className="bg-slate-100">
        <h2 className="my-8 text-xl font-bold">
          Links: <NavLink to="/bank/stats">Statistics</NavLink> •{" "}
          <NavLink to="/bank/create">New</NavLink>
        </h2>
      </nav>
      <div>
        <Outlet />
      </div>
    </div>
  )
}