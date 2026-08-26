import { Fragment } from "react"
import { redirect, type LoaderFunctionArgs } from "react-router"
import { type LoggedInUser } from "~/services/auth/auth.server"
import { getUserFromSession } from "~/services/auth/session.server"

export async function loader({ request }: LoaderFunctionArgs) {
  const loggedInUser: LoggedInUser | undefined = await getUserFromSession(
    request
  )
  if (loggedInUser === undefined) {
    throw new Response(null, {
      status: 404,
      statusText: `No user found for the given session`,
    })
  }

  return redirect(`/profile/${loggedInUser.email}`)
}

export default function Profile() {
  return <Fragment></Fragment>
}
