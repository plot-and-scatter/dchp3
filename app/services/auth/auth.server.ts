import { Auth0Strategy } from "remix-auth-auth0"
import { Authenticator } from "remix-auth"
import { getBaseDeploymentUrl } from "utils/api.server"
import { data } from "react-router"
import { sessionStorage } from "./session.server"
import { getEmail, getIsAdmin, getRolesFromProfile } from "utils/user.server"
import type { AuthRole } from "./AuthRole"
import { ensureLocalUserForLogin } from "~/models/user.server"

export type LoggedInUser = {
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
    async (strategyArgs): Promise<LoggedInUser> => {
      const { profile } = strategyArgs

      const name = profile.displayName || "No name set in profile"
      const [firstName, ...lastName] = name.split(" ")

      // Validated rather than cast: an unrecognised role name yields no
      // role at all instead of a permission set that does not exist.
      const roles = getRolesFromProfile(profile)

      const isAdmin = getIsAdmin(profile)
      const email = getEmail(profile)

      if (!email)
        throw data({ message: "No email defined on user!" }, { status: 500 })

      // Creating the row if there is none, and leaving it alone if there is.
      // See ensureLocalUserForLogin: signing in must not reactivate someone an
      // administrator has deactivated.
      const user = await ensureLocalUserForLogin({
        email,
        firstName,
        lastName: lastName.join(" "),
      })

      if (!user) {
        throw data(
          {
            message: `No user in database with email ${email}, and could not create one`,
          },
          { status: 500 }
        )
      }

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
