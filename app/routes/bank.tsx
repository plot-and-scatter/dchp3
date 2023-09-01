import { NavLink, Outlet } from "@remix-run/react"
import type { LoaderArgs } from "@remix-run/server-runtime"
import { redirectIfUserNotLoggedIn } from "~/services/auth/session.server"

export const loader = async ({ request }: LoaderArgs) => {
  await redirectIfUserNotLoggedIn(request)

  return {}
}

export default function BankIndex() {
  return (
    <div className="mt-36">
      <nav className="bg-slate-100 p-2">
        <h2 className="text-xl font-bold">
          Bank of Canadian English:{" "}
          <NavLink to="/bank/headword-list">Headword list</NavLink> •{" "}
          <NavLink to="/bank/create">New</NavLink> •{" "}
          <NavLink to="/bank/own">Show own</NavLink> •{" "}
          <NavLink to="/bank/search">Search</NavLink>
        </h2>
      </nav>
      <div className="p-12">
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
