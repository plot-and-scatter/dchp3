import { type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router"
import { useLoaderData } from "react-router"
import { PageHeader } from "~/components/elements/Headings/PageHeader"
import UserDirectoryTable from "~/components/admin/UserDirectoryTable"
import { redirectIfUserLacksPermission } from "~/services/auth/session.server"
import { getUserDirectory } from "~/services/auth/userDirectory.server"

// The administrator-only user management screen. This issue is the list; the
// create, change-role and deactivate actions are #443, #444 and #445.
//
// The loader guard and the action guard are separate. A loader guard alone
// protects only what a person can see; a form post goes to the action and
// would never touch the loader.

export const MANAGE_USERS_PERMISSION = "det:manageUsers" as const

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await redirectIfUserLacksPermission(request, MANAGE_USERS_PERMISSION)

  // getUserDirectory reports an unreachable Auth0 in its return value rather
  // than throwing, so the page can still show the local rows.
  return await getUserDirectory()
}

export const action = async ({ request }: ActionFunctionArgs) => {
  await redirectIfUserLacksPermission(request, MANAGE_USERS_PERMISSION)
  return null
}

export default function AdminUsers() {
  const { users, auth0Error } = useLoaderData<typeof loader>()

  return (
    <div className="mt-8">
      <PageHeader>Manage users</PageHeader>

      {auth0Error && (
        <div
          role="alert"
          className="my-4 border-l-4 border-amber-500 bg-amber-50 p-4"
        >
          <p className="font-semibold">Auth0 could not be reached.</p>
          <p className="mt-1">
            The people below are the rows in this site's own database. Roles and
            login accounts are not shown, because they live in Auth0. Nobody has
            lost access — this page could not read it.
          </p>
          <p className="mt-1 text-sm text-gray-700">{auth0Error.message}</p>
        </div>
      )}

      <p className="my-4">
        {users.length} {users.length === 1 ? "person" : "people"}, from Auth0
        and from this site's database.
      </p>

      <UserDirectoryTable users={users} />
    </div>
  )
}
