import type { LoaderFunctionArgs } from "react-router"
import { authenticator } from "~/services/auth/auth.server"

export let loader = async ({ request }: LoaderFunctionArgs) => {
  const myAuthenticator = authenticator()

  return myAuthenticator.authenticate("auth0", request, {
    successRedirect: "/admin",
  })
}
