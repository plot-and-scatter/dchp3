import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import NavPopoverContents from "./NavPopoverContents"
import type { AuthRole } from "~/services/auth/AuthRole"

// The Manage users link is the first navigation item gated on a permission
// rather than on merely being logged in.

const renderNav = (roles: AuthRole[]) =>
  render(
    <MemoryRouter>
      <NavPopoverContents userName="Someone" isAdmin roles={roles} />
    </MemoryRouter>
  )

describe("NavPopoverContents", () => {
  it("shows Manage users to a Superadmin", () => {
    renderNav(["Superadmin"])
    expect(screen.getByText("Manage users")).toBeInTheDocument()
  })

  it.each(["Display", "Student / Editor", "Research Assistant"] as AuthRole[])(
    "hides Manage users from a %s",
    (role) => {
      renderNav([role])
      expect(screen.queryByText("Manage users")).not.toBeInTheDocument()
    }
  )

  it("hides Manage users when no roles are passed", () => {
    render(
      <MemoryRouter>
        <NavPopoverContents userName="Someone" isAdmin />
      </MemoryRouter>
    )
    expect(screen.queryByText("Manage users")).not.toBeInTheDocument()
  })
})
