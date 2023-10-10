import { type Prisma } from "@prisma/client"
import { useLoaderData } from "@remix-run/react"
import { type LoaderArgs } from "@remix-run/server-runtime"
import Main from "~/components/elements/Main"
import EntryList from "~/components/profile/EntryList"
import UserList from "~/components/profile/UserList"
import { getAllUsers, getEntriesByUserEmail } from "~/models/user.server"
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
  // TODO: only return this info if you are above certain permissions level
  const users = await getAllUsers()
  return { username, entries, users }
}

type loaderData = Prisma.PromiseReturnType<typeof loader>

export default function Profile() {
  // remix bug - see: https://github.com/remix-run/remix/issues/3931
  const data = useLoaderData<typeof loader>() as unknown as loaderData
  console.log(data.users)

  return (
    <Main center={true}>
      <h1 className="text-4xl">Profile: {data.username}</h1>
      <div className="m-6 flex">
        <UserList users={data.users} />
        <EntryList logEntries={data.entries} />
      </div>
    </Main>
  )
}
