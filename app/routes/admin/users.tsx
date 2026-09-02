import { Outlet } from "react-router"
import { type LoaderFunctionArgs } from "react-router"
import { redirectIfUserLacksPermission } from "~/services/auth/session.server"

// A layout for /admin/users and everything under it. The list is index.tsx and
// the form for adding someone is new.tsx.
//
// The permission is declared here so there is one answer to who may manage
// users. Note that this guards loaders only: a child route's action does not
// run a parent loader, so each action guards itself as well.

export const MANAGE_USERS_PERMISSION = "det:manageUsers" as const

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await redirectIfUserLacksPermission(request, MANAGE_USERS_PERMISSION)
  return null
}

export default function AdminUsersLayout() {
  return <Outlet />
}
