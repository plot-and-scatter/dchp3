import { redirectIfUserNotLoggedIn } from "~/services/auth/session.server"

export const loader = async (request: Request) => {
  await redirectIfUserNotLoggedIn(request)

  return {}
}

export default function BankIndex() {
  return (
    <>
      <h1>Bank Index</h1>
    </>
  )
}
