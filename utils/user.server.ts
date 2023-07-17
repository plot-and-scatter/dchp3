import type { Auth0Profile } from "remix-auth-auth0"

export const ADMIN_ROLE = "Admin"

export type DCHPAuth0Profile = Auth0Profile & {
  _json?: Auth0Profile["_json"] & {
    "https://dchp.ca/roles"?: string[]
  }
}

export const getIsAdmin = (profile: DCHPAuth0Profile) => {
  const roles = profile._json
    ? profile._json["https://dchp.ca/roles"] || []
    : []
  return roles.includes(ADMIN_ROLE)
}

export const getEmail = (profile: Auth0Profile) => {
  return profile._json?.email
}
