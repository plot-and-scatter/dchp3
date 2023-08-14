import type { LoaderArgs } from "@remix-run/server-runtime"
import { PageHeader } from "~/components/elements/PageHeader"
import { redirectIfUserNotLoggedIn } from "~/services/auth/session.server"

export const loader = async ({ request }: LoaderArgs) => {
  await redirectIfUserNotLoggedIn(request)

  return {}
}

export default function BankIndex() {
  return <PageHeader>Bank Index</PageHeader>
}
