import { type Prisma } from "@prisma/client"
import { useLoaderData } from "@remix-run/react"
import { redirect, type LoaderArgs } from "@remix-run/server-runtime"
import Main from "~/components/elements/Main"
import EntryList from "~/components/profile/EntryList"
import ProfileHeader from "~/components/profile/ProfileHeader"
import {
  getAllUsers,
  getEntryLogsByUserEmail,
  getUserByEmailSafe,
} from "~/models/user.server"
import {
  getEmailFromSession,
  userHasPermission,
} from "~/services/auth/session.server"

async function redirectIfUserLacksEmailAccess(request: Request, email: string) {
  if (await userHasPermission(request, "det:viewUsers")) {
    return
  }

  const userEmail = await getEmailFromSession(request)
  if (userEmail !== email) throw redirect("/not-allowed")
}

export async function loader({ request, params }: LoaderArgs) {
  const email = params.userEmail ?? ""
  await redirectIfUserLacksEmailAccess(request, email)
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
