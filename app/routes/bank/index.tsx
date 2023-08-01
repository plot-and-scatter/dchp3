import { PageHeader } from "~/components/elements/PageHeader"
import { redirectIfUserNotLoggedIn } from "~/services/auth/session.server"

export const loader = async (request: Request) => {
  await redirectIfUserNotLoggedIn(request)

  return {}
}

export default function BankIndex() {
  return <PageHeader>Bank Index</PageHeader>
}
