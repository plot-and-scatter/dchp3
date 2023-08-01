import { json, type LoaderArgs } from "@remix-run/server-runtime"
import { redirectIfUserNotLoggedIn } from "~/services/auth/session.server"
import LogoutButton from "~/components/auth/LogoutButton"
import { Link } from "@remix-run/react"
import { PageHeader } from "~/components/elements/PageHeader"

export const loader = async ({ request }: LoaderArgs) => {
  await redirectIfUserNotLoggedIn(request)

  return json({})
}

export default function Admin() {
  return (
    <div className="p-12">
      <PageHeader>Admin</PageHeader>
      <p>You are logged in.</p>
      <p>
        <Link to="/" className="font-semibold text-blue-500">
          Home
        </Link>
      </p>
      <div>
        <LogoutButton />
      </div>
    </div>
  )
}
