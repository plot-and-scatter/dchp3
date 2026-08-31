import { Fragment } from "react"
import NavItem from "./NavItem"
import type { NavItemProps } from "./NavItem"
import { rolesContainPermission } from "~/services/auth/AuthRole"
import type { AuthPermission, AuthRole } from "~/services/auth/AuthRole"

// Every item in this menu is gated on the permission the route it links to
// actually enforces, so the menu shows a person only what they can open.
//
// It used to be gated on an `isAdmin` prop that Nav.tsx passed as `!!user`,
// which is true for everyone who is logged in. So a Display user was shown
// Manage users, Insert entry, and the rest, and got redirected to
// /not-allowed on clicking any of them.
//
// An item with no permission is shown to every logged-in user: /profile and
// /admin are both open to anyone with a session, and /admin is where a person
// reads their own roles and permissions.

type NavSection = {
  heading?: string
  items: (NavItemProps & { permission?: AuthPermission })[]
}

const NAV_SECTIONS: NavSection[] = [
  {
    items: [
      {
        name: "Your profile",
        href: "/profile",
        icon: <i className="fas fa-user" />,
      },
      {
        name: "Admin interface",
        href: "/admin",
        icon: <i className="fas fa-key" />,
      },
      {
        name: "Display Users",
        href: "/users",
        icon: <i className="fas fa-key" />,
        permission: "det:viewUsers",
      },
      {
        name: "Manage users",
        href: "/admin/users",
        icon: <i className="fas fa-user-gear" />,
        permission: "det:manageUsers",
      },
      {
        name: "All Editing History",
        href: "/editHistory",
        icon: <i className="fas fa-key" />,
        permission: "det:viewEdits",
      },
    ],
  },
  {
    heading: "Bank",
    items: [
      {
        name: "Add citation",
        href: "/bank/create",
        icon: <i className="far fa-file-plus" />,
        permission: "bank:create",
      },
      {
        name: "Your citations",
        href: "/bank/own",
        icon: <i className="far fa-file-heart" />,
        permission: "bank:create",
      },
      {
        name: "Browse citations",
        href: "/bank/headword-list",
        icon: <i className="far fa-files" />,
        permission: "bank:read",
      },
      {
        name: "Search citations",
        href: "/bank/search",
        icon: <i className="far fa-file-magnifying-glass" />,
        permission: "bank:read",
      },
    ],
  },
  {
    heading: "DCHP",
    items: [
      {
        name: "Insert entry",
        href: "/insertEntry",
        icon: <i className="fa fa-book-font" />,
        permission: "det:createDraft",
      },
    ],
  },
]

interface NavPopoverContentsProps {
  roles?: AuthRole[]
}

export default function NavPopoverContents({
  roles = [],
}: NavPopoverContentsProps) {
  const navItems: NavItemProps[] = []

  NAV_SECTIONS.forEach((section) => {
    const visible = section.items.filter(
      ({ permission }) =>
        permission === undefined || rolesContainPermission(roles, permission)
    )

    // A heading with nothing under it is not a section, so drop both.
    if (visible.length === 0) return

    if (section.heading) navItems.push({ name: section.heading })

    visible.forEach(({ permission: _permission, ...item }) =>
      navItems.push(item)
    )
  })

  return (
    <Fragment>
      <div className="relative grid gap-2 bg-white p-4">
        {navItems.map((ni) => (
          <NavItem key={`${ni.name}-${ni.href}`} {...ni} />
        ))}
      </div>
    </Fragment>
  )
}
