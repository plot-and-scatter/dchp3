import { json, type LoaderArgs } from "@remix-run/server-runtime"
import LogoutButton from "~/components/auth/LogoutButton"
import {
  isUserLoggedIn,
  redirectIfUserNotLoggedIn,
} from "~/services/auth/session.server"

export const loader = async ({ request }: LoaderArgs) => {
  await redirectIfUserNotLoggedIn(request)

  console.log("request", request)

  console.log(isUserLoggedIn(request))

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
