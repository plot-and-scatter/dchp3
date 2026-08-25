import type { LoaderFunctionArgs } from "@remix-run/server-runtime"
import { authenticator } from "~/services/auth/auth.server"

export let loader = async ({ request }: LoaderFunctionArgs) => {
  const myAuthenticator = authenticator()

  return myAuthenticator.authenticate("auth0", request, {
    successRedirect: "/admin",
  })
}
