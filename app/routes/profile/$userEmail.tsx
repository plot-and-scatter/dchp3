import { type Prisma } from "@prisma/client"
import { useLoaderData } from "@remix-run/react"
import { type LoaderArgs } from "@remix-run/server-runtime"
import Main from "~/components/elements/Main"
import EntryList from "~/components/profile/EntryList"
import ProfileHeader from "~/components/profile/ProfileHeader"
import {
  getAllUsers,
  getEntryLogsByUserEmail,
  getUserByEmailSafe,
} from "~/models/user.server"
import { userHasPermission } from "~/services/auth/session.server"

export async function loader({ request, params }: LoaderArgs) {
  // TODO: Throw redirect if 1. no det:viewUsers, or 2. User doesn't own this page
  const email = params.userEmail ?? ""
  const user = await getUserByEmailSafe({ email })
  const entries = await getEntryLogsByUserEmail(email)
  const displayUsers = await userHasPermission(request, "det:viewUsers")

  let users = undefined
  if (displayUsers) users = await getAllUsers()

  if (!user) {
    throw new Response(null, {
      status: 404,
      statusText: `User not found`,
    })
  }

  return { user, users, entries, displayUsers }
}

type loaderData = Prisma.PromiseReturnType<typeof loader>

export default function Profile() {
  // remix bug - see: https://github.com/remix-run/remix/issues/3931
  const data = useLoaderData<typeof loader>() as unknown as loaderData

  return (
    <Main center={true}>
      <ProfileHeader user={data.user} />
      <div className="m-6 flex">
        <EntryList logEntries={data.entries} />
      </div>
    </Main>
  )
}
