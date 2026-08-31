import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import NavPopoverContents from "./NavPopoverContents"
import type { AuthRole } from "~/services/auth/AuthRole"

// The menu used to be gated on an isAdmin prop that Nav.tsx passed as `!!user`,
// so every logged-in user saw every item and a Display user was offered links
// that redirect them to /not-allowed. These tests pin the whole menu against
// each role, not only the item added most recently, because the failure mode
// is an item that quietly appears for the wrong role.

const renderNav = (roles?: AuthRole[]) =>
  render(
    <MemoryRouter>
      <NavPopoverContents roles={roles} />
    </MemoryRouter>
  )

const ALWAYS = ["Your profile", "Admin interface"]
const BANK_READ = ["Bank", "Browse citations", "Search citations"]
const BANK_WRITE = ["Add citation", "Your citations"]
const EDITOR = ["All Editing History", "DCHP", "Insert entry"]
const SUPERADMIN_ONLY = ["Display Users", "Manage users"]

const EVERY_ITEM = [
  ...ALWAYS,
  ...BANK_READ,
  ...BANK_WRITE,
  ...EDITOR,
  ...SUPERADMIN_ONLY,
]

const expectExactly = (visible: string[]) => {
  visible.forEach((name) => expect(screen.getByText(name)).toBeInTheDocument())

  EVERY_ITEM.filter((name) => !visible.includes(name)).forEach((name) =>
    expect(screen.queryByText(name)).not.toBeInTheDocument()
  )
}

describe("NavPopoverContents", () => {
  it("shows a Display user only what Display can open", () => {
    renderNav(["Display"])
    expectExactly([...ALWAYS, ...BANK_READ])
  })

  it("shows a Student / Editor the bank and entry items but no user administration", () => {
    renderNav(["Student / Editor"])
    expectExactly([...ALWAYS, ...BANK_READ, ...BANK_WRITE, ...EDITOR])
  })

  it("shows a Research Assistant the same items as a Student / Editor", () => {
    // The extra permissions a Research Assistant holds -- bank:editAny,
    // det:editAny, det:editReferences -- have no menu item of their own.
    renderNav(["Research Assistant"])
    expectExactly([...ALWAYS, ...BANK_READ, ...BANK_WRITE, ...EDITOR])
  })

  it("shows a Superadmin everything", () => {
    renderNav(["Superadmin"])
    expectExactly(EVERY_ITEM)
  })

  it("shows a user with no roles only the items open to anyone logged in", () => {
    renderNav([])
    expectExactly(ALWAYS)
  })

  it("shows the same when the roles prop is absent", () => {
    renderNav(undefined)
    expectExactly(ALWAYS)
  })

  it("hides a section heading when the whole section is hidden", () => {
    renderNav([])
    expect(screen.queryByText("Bank")).not.toBeInTheDocument()
    expect(screen.queryByText("DCHP")).not.toBeInTheDocument()
  })

  it("unions the permissions of a user holding more than one role", () => {
    renderNav(["Display", "Superadmin"])
    expectExactly(EVERY_ITEM)
  })
})
