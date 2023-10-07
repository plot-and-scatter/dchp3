import { useLoaderData } from "@remix-run/react"
import { type LoaderArgs } from "@remix-run/server-runtime"
import Main from "~/components/elements/Main"
import { getEntriesByUserEmail } from "~/models/user.server"
import { type LoggedInUser } from "~/services/auth/auth.server"
import { getUserFromSession } from "~/services/auth/session.server"

export async function loader({ request }: LoaderArgs) {
  const user: LoggedInUser | undefined = await getUserFromSession(request)
  if (user === undefined) {
    throw new Response(null, {
      status: 404,
      statusText: `No user found for the given session`,
    })
  }

  const username = user.name
  const entries = await getEntriesByUserEmail(user.email)
  return { username, entries }
}

export default function Profile() {
  const data = useLoaderData<typeof loader>()

  return (
    <Main center={true}>
      <h1 className="text-4xl">Profile: {data.username}</h1>
      <div className="flex flex-col items-center">
        {data.entries.map((e) => {
          return <p key={e.entry_id}>{e.entry_id}</p>
        })}
      </div>
    </Main>
  )
}
