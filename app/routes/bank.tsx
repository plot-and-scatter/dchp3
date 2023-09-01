import { NavLink, Outlet } from "@remix-run/react"
import type { LoaderArgs } from "@remix-run/server-runtime"
import { redirectIfUserNotLoggedIn } from "~/services/auth/session.server"

const navItems = [
  {
    name: "Add citation",
    href: "/bank/create",
    icon: <i className="far fa-file-plus" />,
  },
  {
    name: "Your citations",
    href: "/bank/own",
    icon: <i className="far fa-file-heart" />,
  },
  {
    name: "Browse citations",
    href: "/bank/headword-list",
    icon: <i className="far fa-files" />,
  },
  {
    name: "Search citations",
    href: "/bank/search",
    icon: <i className="far fa-file-magnifying-glass" />,
  },
]

export const loader = async ({ request }: LoaderArgs) => {
  await redirectIfUserNotLoggedIn(request)

  return {}
}

export default function BankIndex() {
  return (
    <div className="mt-32">
      <nav className="flex items-center border-b border-b-slate-300 bg-slate-100 p-2 shadow">
        <h2 className="text-xl font-bold">Bank of Canadian English</h2>
        <div>
          {navItems.map((ni) => (
            <NavLink
              key={ni.href}
              to={ni.href}
              className="ml-4 text-red-600 hover:text-red-800"
            >
              {ni.icon}
              <span className="ml-2">{ni.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>
      <div className="p-12 pt-4">
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
