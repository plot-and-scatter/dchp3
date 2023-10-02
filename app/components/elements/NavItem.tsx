import { Link } from "@remix-run/react"

type NavItem = {
  name: string
  href?: string
  icon?: React.ReactNode
  description?: string
}

export type NavItemProps = {
  name: string
  href?: string
  icon?: React.ReactNode
  description?: string
}

export default function NavItem(item: NavItemProps) {
  if (!item.href) {
    // This is a separator, not a link
    return <div>{item.name}</div>
  } else {
    return (
      <Link
        key={item.name}
        to={item.href}
        className="group -m-1 flex items-center rounded-lg p-1 transition duration-150 ease-in-out hover:bg-slate-100 focus:outline-none focus-visible:ring-opacity-50"
      >
        <div className="flex h-6 w-6 shrink-0 items-center justify-center ">
          {item.icon}
        </div>
        <div className="ml-2 text-base">
          <p className="mb-0 font-semibold text-red-500">{item.name}</p>
          {item.description && (
            <p className="text-sm text-slate-500">{item.description}</p>
          )}
        </div>
      </Link>
    )
  }
}
