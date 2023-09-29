import { useLoaderData } from "@remix-run/react"
import { PageHeader } from "~/components/elements/PageHeader"
import {
  getEmailFromSession,
  redirectIfUserNotLoggedIn,
} from "~/services/auth/session.server"
import { type LoaderArgs } from "@remix-run/server-runtime"
import LogoutButton from "~/components/auth/LogoutButton"
import Main from "~/components/elements/Main"
import { DchpLink } from "~/components/elements/LinksAndButtons/Link"

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
          <DchpLink to="/">Home</DchpLink>
        </p>
        <div>
          <LogoutButton />
        </div>
      </div>
    </Main>
  )
}
