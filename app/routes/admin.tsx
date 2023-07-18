import { json, type LoaderArgs } from "@remix-run/server-runtime"
import { redirectIfUserNotLoggedIn } from "~/services/auth/session.server"
import LogoutButton from "~/components/auth/LogoutButton"

export const loader = async ({ request }: LoaderArgs) => {
  await redirectIfUserNotLoggedIn(request)

  return json({})
}

export default function Admin() {
  return (
    <>
      <h1>Admin</h1>
      <p>You are logged in.</p>
      <div>
        <LogoutButton />
      </div>
    </>
  )
}
