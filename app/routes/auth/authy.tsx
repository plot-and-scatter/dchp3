import type { ActionArgs } from "@remix-run/server-runtime"
import { redirect } from "@remix-run/server-runtime"
import { authenticator } from "~/services/auth/auth.server"

export let loader = () => redirect("/admin")

export let action = ({ request }: ActionArgs) => {
  return authenticator().authenticate("auth0", request)
}

export default function Authy() {
  return <>Authy</>
}
