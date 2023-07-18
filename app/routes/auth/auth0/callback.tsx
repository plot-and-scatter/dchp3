import type { LoaderArgs } from "@remix-run/server-runtime"
import { authenticator } from "~/services/auth/auth.server"

export let loader = async ({ request }: LoaderArgs) => {
  const myAuthenticator = authenticator()

  return myAuthenticator.authenticate("auth0", request, {
    successRedirect: "/admin",
  })
}
