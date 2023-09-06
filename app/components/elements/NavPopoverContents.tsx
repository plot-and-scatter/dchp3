import NavItem from "./NavItem"
import type { NavItemProps } from "./NavItem"

interface NavPopoverContentsProps {
  userName: string
  isAdmin?: boolean
}

export default function NavPopoverContents({
  userName,
  isAdmin,
}: NavPopoverContentsProps) {
  const navItems: NavItemProps[] = [
    {
      name: "Your profile",
      href: "/profile",
      icon: <i className="fas fa-user" />,
    },
  ]

  if (isAdmin) {
    navItems.push({
      name: "Admin interface",
      href: "/admin",
      icon: <i className="fas fa-key" />,
    })
    navItems.push({ name: "Bank" })
    navItems.push({
      name: "Add citation",
      href: "/bank/create",
      icon: <i className="far fa-file-plus" />,
    })
    navItems.push({
      name: "Your citations",
      href: "/bank/own",
      icon: <i className="far fa-file-heart" />,
    })
    navItems.push({
      name: "Browse citations",
      href: "/bank/headword-list",
      icon: <i className="far fa-files" />,
    })
    navItems.push({
      name: "Search citations",
      href: "/bank/search",
      icon: <i className="far fa-file-magnifying-glass" />,
    })
    navItems.push({ name: "DCHP" })
    navItems.push({
      name: "Insert entry",
      href: "/insertEntry",
      icon: <i className="fa fa-book-font" />,
    })
    navItems.push({ name: "" })
  }

  return (
    <>
      <div className="relative grid gap-2 bg-white p-4">
        {navItems.map((ni) => (
          <NavItem key={ni.href} {...ni} />
        ))}
      </div>
    </>
  )
}
