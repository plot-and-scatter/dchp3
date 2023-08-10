import { Link } from "@remix-run/react"
import { PageHeader } from "~/components/elements/PageHeader"
import { redirectIfUserNotLoggedIn } from "~/services/auth/session.server"
import { type LoaderArgs } from "@remix-run/server-runtime"
import LogoutButton from "~/components/auth/LogoutButton"
import Main from "~/components/elements/Main"

export const loader = async ({ request }: LoaderArgs) => {
  await redirectIfUserNotLoggedIn(request)

  return null
}

export default function Admin() {
  return (
    <Main>
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
    </Main>
  )
}
