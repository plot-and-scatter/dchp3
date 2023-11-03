import { useLoaderData } from "@remix-run/react"
import { type LoaderArgs } from "@remix-run/server-runtime"
import Main from "~/components/elements/Main"
import UserList from "~/components/profile/UserList"
import { getAllUsers } from "~/models/user.server"
import { redirectIfUserLacksPermission } from "~/services/auth/session.server"

export async function loader({ request, params }: LoaderArgs) {
  redirectIfUserLacksPermission(request, "det:viewUsers")
  const users = await getAllUsers()

  return { users }
}

export default function Users() {
  const data = useLoaderData<typeof loader>()

  return (
    <Main center={true}>
      <h1 className="text-4xl">Users</h1>
      <UserList users={data.users} />
    </Main>
  )
}
