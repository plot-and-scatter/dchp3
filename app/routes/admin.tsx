import { Outlet, useLoaderData } from "@remix-run/react"
import { PageHeader } from "~/components/elements/Headings/PageHeader"
import {
  getEmailFromSession,
  getUserPermissions,
  redirectIfUserNotLoggedIn,
} from "~/services/auth/session.server"
import { type LoaderArgs } from "@remix-run/server-runtime"
import LogoutButton from "~/components/auth/LogoutButton"
import Main from "~/components/elements/Main"
import { SecondaryHeader } from "~/components/elements/Headings/SecondaryHeader"
import type { AuthRole } from "~/services/auth/AuthRole"

export const loader = async ({ request }: LoaderArgs) => {
  await redirectIfUserNotLoggedIn(request)

  const email = await getEmailFromSession(request)

  const roleAndPermissionMap = await getUserPermissions(request)

  return { email, roleAndPermissionMap }
}

export default function Admin() {
  const { email, roleAndPermissionMap } = useLoaderData<typeof loader>()

  return (
    <Main>
      <div>
        <PageHeader>Your access</PageHeader>
        <p>
          You are logged in as <strong>{email}</strong>
        </p>
        <div className="my-4">
          <LogoutButton />
        </div>
        <SecondaryHeader>Roles and permissions</SecondaryHeader>
        <div className="flex flex-row">
          {Object.keys(roleAndPermissionMap).map((role) => {
            return (
              <div key={role}>
                <p className="font-semibold">{role}</p>
                {roleAndPermissionMap[role as AuthRole]?.map((permission) => (
                  <p key="permission" className="pl-4">
                    {permission}
                  </p>
                ))}
              </div>
            )
          })}
        </div>
        <Outlet />
      </div>
    </Main>
  )
}
