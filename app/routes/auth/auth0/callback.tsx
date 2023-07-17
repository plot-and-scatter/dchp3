import { useLoaderData } from "@remix-run/react"
import type { LoaderArgs } from "@remix-run/server-runtime"
import { AuthorizationError } from "remix-auth"
import { authenticator } from "~/services/auth/auth.server"

export let loader = async ({ request }: LoaderArgs) => {
  // TODO: Instead of redirecting to the dashboard, redirect to a login gate
  // where we can determine whether this user has accepted terms, etc.

  console.log("GOT HERE")

  console.log("REQUEST", request)

  const myAuthenticator = authenticator()

  try {
    return await myAuthenticator.authenticate("auth0", request, {
      successRedirect: "/admin",
      throwOnError: true,
    })
  } catch (error) {
    // Because redirects work by throwing a Response, you need to check if the
    // caught error is a response and return it or throw it again
    if (error instanceof Response) return error
    if (error instanceof AuthorizationError) {
      // here the error is related to the authentication process
      console.error("!!!")
      console.error(error)
    }
    // here the error is a generic error that another reason may throw
    return {}
  }
}

export default function Authy() {
  const foo = useLoaderData<typeof loader>()

  console.log("foo -->", foo)

  return <>Uh oh</>
}
