import { useLoaderData } from "@remix-run/react"
import { type LoaderArgs } from "@remix-run/server-runtime"
import { useState } from "react"
import Button from "~/components/elements/LinksAndButtons/Button"
import Main from "~/components/elements/Layouts/Main"
import UserListSection from "~/components/profile/UserListSection"
import { type User, getAllUsers } from "~/models/user.server"
import { redirectIfUserLacksPermission } from "~/services/auth/session.server"

export async function loader({ request, params }: LoaderArgs) {
  redirectIfUserLacksPermission(request, "det:viewUsers")
  const users = await getAllUsers()

  return { users }
}

function isAccessLevel(user: User, level: number) {
  if (user === null) return false
  return user.access_level === level
}

export default function Users() {
  const [displayInactive, setDisplayInactive] = useState(false)
  const data = useLoaderData<typeof loader>()
  const users = data.users
  if (users === undefined) return <></>

  return (
    <Main center={true}>
      <div className="flex flex-row">
        <h1 className="mx-4 text-4xl">Users</h1>
        <Button
          type="button"
          onClick={(e) => setDisplayInactive(!displayInactive)}
        >
          {displayInactive ? "Hide Inactive Users" : "Display Inactive Users"}
        </Button>
      </div>
      <div className="flex flex-col">
        <UserListSection
          header="Superadmin"
          users={users.filter((user) => isAccessLevel(user, 1))}
          displayInactive={displayInactive}
        />
        <UserListSection
          header="Research Assistant"
          users={users.filter((user) => isAccessLevel(user, 2))}
          displayInactive={displayInactive}
        />
        <UserListSection
          header="Student / Editor"
          users={users.filter((user) => isAccessLevel(user, 3))}
          displayInactive={displayInactive}
        />
        <UserListSection
          header="Display"
          users={users.filter((user) => isAccessLevel(user, 0))}
          displayInactive={displayInactive}
        />
      </div>
    </Main>
  )
}
