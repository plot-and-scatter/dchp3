import {
  AUTH_ROLES,
  isAuthRole,
  parseAuthRoles,
  roleHasPermission,
  type AuthRole,
} from "./AuthRole"
import { getIsAdmin, getRolesFromProfile } from "utils/user.server"
import type { DCHPAuth0Profile } from "utils/user.server"

// The roles claim is whatever the Auth0 tenant put in the token. Before this
// milestone it was cast straight to AuthRole[], so a role renamed in Auth0
// would have produced a role with no permission set and no error. These tests
// pin the validating behaviour that replaced the cast. See docs/auth/roles.md.

const profileWithRoles = (roles: unknown): DCHPAuth0Profile =>
  ({
    _json: { "https://dchp.ca/roles": roles },
  } as unknown as DCHPAuth0Profile)

describe("isAuthRole", () => {
  it.each(AUTH_ROLES)("accepts the tenant role %s", (role) => {
    expect(isAuthRole(role)).toBe(true)
  })

  it.each([
    ["a role that is not in the tenant", "Admin"],
    ["a near miss on case", "superadmin"],
    ["a near miss on spacing", "Student/Editor"],
    ["the empty string", ""],
  ])("rejects %s", (_description, value) => {
    expect(isAuthRole(value)).toBe(false)
  })

  it.each([
    ["undefined", undefined],
    ["null", null],
    ["a number", 1],
    ["an object", { name: "Superadmin" }],
  ])("rejects %s", (_description, value) => {
    expect(isAuthRole(value)).toBe(false)
  })
})

describe("parseAuthRoles", () => {
  it("keeps every recognised role", () => {
    expect(parseAuthRoles([...AUTH_ROLES])).toEqual([...AUTH_ROLES])
  })

  it("drops role names the application does not know", () => {
    expect(parseAuthRoles(["Superadmin", "Admin", "Editor"])).toEqual([
      "Superadmin",
    ])
  })

  it("returns no roles for a missing claim", () => {
    expect(parseAuthRoles(undefined)).toEqual([])
  })

  it("returns no roles when the claim is not an array", () => {
    expect(parseAuthRoles("Superadmin")).toEqual([])
  })

  it("returns no roles for an array of non-strings", () => {
    expect(parseAuthRoles([{ name: "Superadmin" }, 3])).toEqual([])
  })
})

describe("getRolesFromProfile", () => {
  it("reads the dchp.ca roles claim", () => {
    expect(
      getRolesFromProfile(profileWithRoles(["Research Assistant"]))
    ).toEqual(["Research Assistant"])
  })

  it("returns no roles for a profile with no claim", () => {
    expect(getRolesFromProfile({} as DCHPAuth0Profile)).toEqual([])
  })
})

describe("getIsAdmin", () => {
  it("is true for a Superadmin", () => {
    expect(getIsAdmin(profileWithRoles(["Superadmin"]))).toBe(true)
  })

  it("is false for every other role", () => {
    AUTH_ROLES.filter((role) => role !== "Superadmin").forEach((role) => {
      expect(getIsAdmin(profileWithRoles([role]))).toBe(false)
    })
  })

  it("is false for the legacy Admin role name, which the tenant does not use", () => {
    expect(getIsAdmin(profileWithRoles(["Admin"]))).toBe(false)
  })
})

describe("roleHasPermission with an unrecognised role", () => {
  it("denies rather than throwing", () => {
    // parseAuthRoles keeps unknown names out of new sessions, but a cookie
    // issued before that check existed can still carry one. Looking up its
    // permissions unguarded turned a denial into a 500.
    expect(
      roleHasPermission("Admin" as unknown as AuthRole, "det:manageUsers")
    ).toBe(false)
  })
})
