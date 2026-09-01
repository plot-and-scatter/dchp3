import { render, screen } from "@testing-library/react"
import { loginBadge, renderBadge, roleBadges } from "./userBadges"
import type { DirectoryUser } from "~/services/auth/userDirectory"

// These are shared by the list and by one person's page. The point of sharing
// them is that a role is the same colour and the same icon in both places, so
// that is what is asserted here rather than in either screen's own tests.

const user = (overrides: Partial<DirectoryUser> = {}): DirectoryUser =>
  ({
    email: "a@b.c",
    name: "A B",
    presence: "both",
    roles: [],
    auth0Accounts: [
      {
        userId: "auth0|1",
        connection: "Username-Password-Authentication",
        blocked: false,
        roles: [],
        lastLogin: null,
        loginsCount: 0,
      },
    ],
    localRows: [],
    contributions: { edits: 0, citations: 0 },
    ...overrides,
  } as DirectoryUser)

describe("role badges", () => {
  it.each([
    ["Superadmin", "text-purple-800", "fa-shield-halved"],
    ["Research Assistant", "text-blue-800", "fa-user-magnifying-glass"],
    ["Student / Editor", "text-gray-700", "fa-pen-to-square"],
    ["Display", "bg-white", "fa-eye"],
  ])("gives %s its own colour and icon", (role, tone, icon) => {
    const { container } = render(
      <span>
        {roleBadges(user({ roles: [role] as DirectoryUser["roles"] })).map(
          (badge) => renderBadge(badge)
        )}
      </span>
    )

    expect(screen.getByText(role).className).toContain(tone)
    expect(container.querySelector(`.${icon}`)).not.toBeNull()
  })

  it("marks an account with no role as one to look at", () => {
    render(<span>{roleBadges(user()).map((badge) => renderBadge(badge))}</span>)
    expect(screen.getByText("No role").className).toContain("alert")
  })
})

describe("login badge", () => {
  it("reads Can log in for an unblocked account", () => {
    render(<span>{renderBadge(loginBadge(user()))}</span>)
    expect(screen.getByText("Can log in")).toBeInTheDocument()
  })
})
