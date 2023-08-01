import { Auth0Strategy } from "remix-auth-auth0"
import { Authenticator } from "remix-auth"
import { getBaseDeploymentUrl } from "utils/api.server"
import { json } from "@remix-run/server-runtime"
import { sessionStorage } from "./session.server"
import { getEmail, getIsAdmin } from "utils/user.server"
import type { AuthRole } from "./AuthRole"

type LoggedInUser = {
  email: string
  isAdmin: boolean
  name: string
  roles: AuthRole[]
}

let _authenticator: Authenticator<LoggedInUser>

export const authenticator = () => {
  // If the authenticator exists, use it.
  if (_authenticator) return _authenticator

  // Otherwise, init the authenticator.
  _authenticator = new Authenticator<LoggedInUser>(sessionStorage)

  const strategy = {
    callbackURL: `${getBaseDeploymentUrl()}/auth/auth0/callback`,
    clientID: process.env.AUTH0_CLIENT_ID!,
    clientSecret: process.env.AUTH0_CLIENT_SECRET!,
    domain: process.env.AUTH0_DOMAIN!,
  }

  const auth0Strategy = new Auth0Strategy(
    strategy,
    async ({ profile }): Promise<LoggedInUser> => {
      console.log("profile", profile)

      const name = profile.displayName || "No name set in profile"

      const roles = (profile._json as any)["https://dchp.ca/roles"]

      const isAdmin = getIsAdmin(profile)
      const email = getEmail(profile)

      if (!email)
        throw json({ message: "No email defined on user!" }, { status: 500 })

      return {
        email,
        isAdmin,
        name,
        roles,
      }
    }
  )
  _authenticator.use(auth0Strategy)

  return _authenticator
}
