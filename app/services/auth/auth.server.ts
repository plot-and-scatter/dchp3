import { Auth0Strategy } from "remix-auth-auth0"
import { Authenticator } from "remix-auth"
import { getBaseDeploymentUrl } from "utils/api.server"
import { getEmail, getIsAdmin } from "utils/user.server"
import { json } from "@remix-run/server-runtime"
import { sessionStorage } from "./session.server"
import type { DCHPAuth0Profile } from "utils/user.server"

type LoggedInUser = {
  email?: string
  isAdmin: boolean
  name: string
}

// Create an instance of the authenticator, pass a generic with what your
// strategies will return and will be stored in the session
let _authenticator: Authenticator<LoggedInUser>

export const authenticator = () => {
  // If the authenticator exists, use it.
  if (_authenticator) return _authenticator

  // Otherwise, init the authenticator.
  // TODO: Does this create a race condition?
  _authenticator = new Authenticator<LoggedInUser>(sessionStorage)

  console.log(process.env.AUTH0_CLIENT_ID)
  console.log(process.env.AUTH0_CLIENT_SECRET)
  console.log(process.env.AUTH0_DOMAIN)

  const strategy = {
    callbackURL: `${getBaseDeploymentUrl()}/auth/auth0/callback`,
    clientID: process.env.AUTH0_CLIENT_ID!,
    clientSecret: process.env.AUTH0_CLIENT_SECRET!,
    domain: process.env.AUTH0_DOMAIN!,
  }

  console.log("----->>>>", strategy)

  const auth0Strategy = new Auth0Strategy(
    strategy,
    async ({
      // accessToken,
      // refreshToken,
      // extraParams,
      profile,
    }): Promise<LoggedInUser> => {
      // Get the user data from your DB or API using the tokens and profile
      console.log("!!!!!! profile", profile)

      const name = profile.displayName || "No name set in profile"
      // const isAdmin = getIsAdmin(profile as DCHPAuth0Profile)
      // const email = getEmail(profile)

      const isAdmin = true
      const email = "foo"

      if (!email)
        throw json({ message: "No email defined on user!" }, { status: 500 })

      // TODO: Also look up user in DB and load their other info.

      return {
        email,
        isAdmin,
        name,
      }
    }
  )
  _authenticator.use(auth0Strategy)

  console.log("_authenticator", _authenticator)

  return _authenticator
}
