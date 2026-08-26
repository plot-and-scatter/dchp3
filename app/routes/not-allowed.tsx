import { Fragment } from "react"
import { data, type LoaderFunctionArgs } from "react-router"
import { getUserRoles, isUserLoggedIn } from "~/services/auth/session.server"
import LoginButton from "~/components/auth/LoginButton"
import { useLoaderData } from "react-router"
import LogoutButton from "~/components/auth/LogoutButton"
import type { AuthRole } from "~/services/auth/AuthRole"
import { getPermissionsMap } from "~/services/auth/AuthRole"
import { PageHeader } from "~/components/elements/Headings/PageHeader"
import TextPageMain from "~/components/elements/Layouts/TextPageMain"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const loggedIn = await isUserLoggedIn(request)
  const roles = await getUserRoles(request)
  const permissionMap = await getPermissionsMap(roles)

  return data({ loggedIn, roles, permissionMap })
}

export default function Admin() {
  const { loggedIn, permissionMap } = useLoaderData<typeof loader>()

  return (
    <TextPageMain>
      <div className="">
        <PageHeader>Not allowed</PageHeader>
        <p>You do not have the permission required for this action.</p>
        {permissionMap && Object.keys(permissionMap).length > 0 && (
          <table>
            <thead>
              <tr>
                <th className="bg-gray-100 p-4 text-left font-bold">Role</th>
                <th className="bg-gray-100 p-4 text-left font-bold">
                  Permissions
                </th>
              </tr>
            </thead>
            <tbody>
              {(Object.keys(permissionMap) as AuthRole[]).map((r) => (
                <tr key={r}>
                  <td className="p-4 align-top font-bold">{r}</td>
                  <td className="p-4 align-top">
                    {(permissionMap[r] as string[]).map((p) => (
                      <Fragment key={p}>
                        <span>{p}</span>
                        <br />
                      </Fragment>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loggedIn ? (
          <Fragment>
            <p>Do you need to log in?</p>
            <div>
              <LoginButton />
            </div>
          </Fragment>
        ) : (
          <Fragment>
            <p>You can log out and try another account.</p>
            <div>
              <LogoutButton />
            </div>
          </Fragment>
        )}
      </div>
    </TextPageMain>
  )
}
