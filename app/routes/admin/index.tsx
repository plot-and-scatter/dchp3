import { useLoaderData } from "react-router"
import { type LoaderFunctionArgs } from "react-router"
import { PageHeader } from "~/components/elements/Headings/PageHeader"
import { SecondaryHeader } from "~/components/elements/Headings/SecondaryHeader"
import LogoutButton from "~/components/auth/LogoutButton"
import StatusBadge from "~/components/elements/Labels/StatusBadge"
import {
  getEmailFromSession,
  getUserPermissions,
} from "~/services/auth/session.server"
import type { AuthRole } from "~/services/auth/AuthRole"

// What /admin itself shows. This was the admin layout until it became clear
// that every child route was inheriting it.

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const email = await getEmailFromSession(request)
  const roleAndPermissionMap = await getUserPermissions(request)

  return { email, roleAndPermissionMap }
}

export default function AdminIndex() {
  const { email, roleAndPermissionMap } = useLoaderData<typeof loader>()
  const roles = Object.keys(roleAndPermissionMap) as AuthRole[]

  return (
    <div>
      <PageHeader>Your access</PageHeader>
      <p className="mt-2">
        You are logged in as <strong>{email}</strong>
      </p>
      <div className="my-4">
        <LogoutButton />
      </div>

      <SecondaryHeader>Roles and permissions</SecondaryHeader>

      {roles.length === 0 ? (
        <p className="mt-2">
          You hold no role, so you have no permissions. Ask an administrator to
          assign you one.
        </p>
      ) : (
        <div className="mt-2 flex flex-col gap-4">
          {roles.map((role) => (
            <div key={role}>
              <p className="font-semibold">{role}</p>
              <div className="mt-1">
                {roleAndPermissionMap[role]?.map((permission) => (
                  <StatusBadge key={permission}>{permission}</StatusBadge>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
