import type { ActionFunctionArgs } from "@remix-run/server-runtime"
import { redirect } from "@remix-run/server-runtime"
import { authenticator } from "~/services/auth/auth.server"

export let loader = () => redirect("/admin")

export let action = ({ request }: ActionFunctionArgs) => {
  return authenticator().authenticate("auth0", request)
}
