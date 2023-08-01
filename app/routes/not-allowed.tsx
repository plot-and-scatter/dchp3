import { json, type LoaderArgs } from "@remix-run/server-runtime"
import { getUserRoles, isUserLoggedIn } from "~/services/auth/session.server"
import LoginButton from "~/components/auth/LoginButton"
import { useLoaderData } from "@remix-run/react"
import LogoutButton from "~/components/auth/LogoutButton"
import type { AuthRole } from "~/services/auth/AuthRole"
import { getPermissionsMap } from "~/services/auth/AuthRole"

export const loader = async ({ request }: LoaderArgs) => {
  const loggedIn = await isUserLoggedIn(request)
  const roles = await getUserRoles(request)
  const permissionMap = await getPermissionsMap(roles)

  console.log("ROLES", roles)

  return json({ loggedIn, roles, permissionMap })
}

export default function Admin() {
  const { loggedIn, permissionMap } = useLoaderData<typeof loader>()

  console.log(permissionMap)

  return (
    <>
      <h1>Not allowed</h1>
      <p>You do not have the permission required for this action.</p>
      {permissionMap && Object.keys(permissionMap).length > 0 && (
        <table>
          <thead>
            <tr>
              <th className="bg-slate-100 p-4 text-left font-bold">Role</th>
              <th className="bg-slate-100 p-4 text-left font-bold">
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
                    <>
                      <span>{p}</span>
                      <br />
                    </>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {!loggedIn ? (
        <>
          <p>Do you need to log in?</p>
          <div>
            <LoginButton />
          </div>
        </>
      ) : (
        <>
          <p>You can log out and try another account.</p>
          <div>
            <LogoutButton />
          </div>
        </>
      )}
    </>
  )
}