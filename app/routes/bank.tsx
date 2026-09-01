import { NavLink, Outlet } from "react-router"
import type { LoaderFunctionArgs } from "react-router"
import { redirectIfUserLacksPermission } from "~/services/auth/session.server"

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

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // bank:read, not merely a session. Every child route relied on this loader
  // for its protection, so being logged in was the whole of the requirement
  // to read the citation bank -- including for someone holding no role at all.
  //
  // A child ACTION does not run this loader, so each route with an action
  // guards itself as well.
  await redirectIfUserLacksPermission(request, "bank:read")

  return {}
}

export default function BankIndex() {
  return (
    <div className="mt-32">
      <nav className="flex items-center border-b border-b-gray-300 bg-gray-100 p-2 shadow">
        <h2 className="text-xl font-bold">Bank of Canadian English</h2>
        <div>
          {navItems.map((ni) => (
            <NavLink
              key={ni.href}
              to={ni.href}
              className="ml-4 text-primary hover:text-primary-dark"
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
