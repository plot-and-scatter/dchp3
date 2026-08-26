import type { ActionFunctionArgs } from "react-router"
import { redirect } from "react-router"
import { authenticator } from "~/services/auth/auth.server"

export let loader = () => redirect("/admin")

export let action = ({ request }: ActionFunctionArgs) => {
  return authenticator().authenticate("auth0", request)
}
