import { type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router"
import { PageHeader } from "~/components/elements/Headings/PageHeader"
import { redirectIfUserLacksPermission } from "~/services/auth/session.server"

// The administrator-only user management screen. This route is the shell: the
// permission and the routing. The list itself is #442 and the create, change
// role and deactivate actions are #443, #444 and #445.
//
// Note that the loader guard and the action guard are separate. A loader guard
// alone protects only what a person can see; a form post goes to the action
// and would never touch the loader.

export const MANAGE_USERS_PERMISSION = "det:manageUsers" as const

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await redirectIfUserLacksPermission(request, MANAGE_USERS_PERMISSION)
  return null
}

export const action = async ({ request }: ActionFunctionArgs) => {
  await redirectIfUserLacksPermission(request, MANAGE_USERS_PERMISSION)
  return null
}

export default function AdminUsers() {
  return (
    <div className="mt-8">
      <PageHeader>Manage users</PageHeader>
      <p className="mt-4">
        Create users, change their role, and deactivate them. The list of users
        appears here once it is built.
      </p>
    </div>
  )
}
