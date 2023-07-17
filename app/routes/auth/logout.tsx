import { useSubmit } from "@remix-run/react"
import type { ActionArgs } from "@remix-run/server-runtime"
import { redirect } from "@remix-run/server-runtime"
import { useEffect } from "react"
import { getBaseDeploymentUrl } from "utils/api.server"
import {
  destroySession,
  getCookieSession,
} from "~/services/auth/session.server"

export const action = async ({ request }: ActionArgs) => {
  const session = await getCookieSession(request)

  const logoutURL = new URL(
    `https://${process.env.AUTH0_DOMAIN as string}/v2/logout`
  )

  logoutURL.searchParams.set("client_id", process.env.AUTH0_CLIENT_ID as string)
  logoutURL.searchParams.set("returnTo", getBaseDeploymentUrl())

  return redirect(logoutURL.toString(), {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  })
}

export default function Logout() {
  const submit = useSubmit()

  // Immediately log the user out. Adapted from https://remix.run/docs/en/main/hooks/use-submit
  useEffect(() => {
    const timer = setTimeout(() => {
      submit(null, { method: "post", action: "/auth/logout" })
    }, 50)

    return () => clearTimeout(timer)
  }, [submit])

  return <>Logging out...</>
}
