import { Link, useLoaderData } from "@remix-run/react"
import { PageHeader } from "~/components/elements/PageHeader"
import {
  getEmailFromSession,
  redirectIfUserNotLoggedIn,
} from "~/services/auth/session.server"
import { type LoaderArgs } from "@remix-run/server-runtime"
import LogoutButton from "~/components/auth/LogoutButton"
import Main from "~/components/elements/Main"
import HeadwordAutocomplete from "~/components/editing/HeadwordAutocomplete"

export const loader = async ({ request }: LoaderArgs) => {
  await redirectIfUserNotLoggedIn(request)

  const email = await getEmailFromSession(request)

  return email
}

export default function Admin() {
  const email = useLoaderData<typeof loader>()

  return (
    <Main>
      <div>
        <PageHeader>Admin</PageHeader>
        <p>You are logged in (email: {email})</p>
        <p>
          <Link to="/" className="font-semibold text-blue-500">
            Home
          </Link>
        </p>
        <div>
          <LogoutButton />
        </div>
        <hr className="my-8" />
        <div>
          <HeadwordAutocomplete />
        </div>
      </div>
    </Main>
  )
}
