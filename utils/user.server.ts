import type { Auth0Profile } from "remix-auth-auth0"
import { parseAuthRoles } from "~/services/auth/AuthRole"

// The custom claim the Auth0 tenant puts the user's roles on.
export const DCHP_ROLES_CLAIM = "https://dchp.ca/roles"

export type DCHPAuth0Profile = Auth0Profile & {
  _json?: Auth0Profile["_json"] & {
    [DCHP_ROLES_CLAIM]?: string[]
  }
}

export const getRolesFromProfile = (profile: DCHPAuth0Profile) =>
  parseAuthRoles(profile._json?.[DCHP_ROLES_CLAIM])

// This used to test for a role named "Admin", which is not one of the four
// roles in the tenant and so never matched. Being an administrator means
// holding the Superadmin role. See docs/auth/roles.md.
export const getIsAdmin = (profile: DCHPAuth0Profile) =>
  getRolesFromProfile(profile).includes("Superadmin")

export const getEmail = (profile: Auth0Profile) => {
  return profile._json?.email
}
