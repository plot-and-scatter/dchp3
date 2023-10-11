import { type Prisma } from "@prisma/client"
import { useLoaderData } from "@remix-run/react"
import { type LoaderArgs } from "@remix-run/server-runtime"
import Main from "~/components/elements/Main"
import EntryList from "~/components/profile/EntryList"
import ProfileHeader from "~/components/profile/ProfileHeader"
import UserList from "~/components/profile/UserList"
import {
  getAllUsers,
  getEntriesByUserEmail,
  getUserByEmail,
} from "~/models/user.server"

export async function loader({ params }: LoaderArgs) {
  // TODO: check to see if you have perms

  const email = params.userEmail ?? ""
  const user = await getUserByEmail({ email })
  const users = await getAllUsers()
  const entries = await getEntriesByUserEmail(email)
  return { user, users, entries }
}

type loaderData = Prisma.PromiseReturnType<typeof loader>

export default function Profile() {
  // remix bug - see: https://github.com/remix-run/remix/issues/3931
  const data = useLoaderData<typeof loader>() as unknown as loaderData

  return (
    <Main center={true}>
      <ProfileHeader user={data.user} />
      <div className="m-6 flex">
        <UserList users={data.users} />
        <EntryList logEntries={data.entries} />
      </div>
    </Main>
  )
}
