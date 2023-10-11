import { createCookieSessionStorage, json, redirect } from "@remix-run/node"
import { LOGIN_PATH, NOT_ALLOWED_PATH } from "utils/paths"
import type { Session } from "@remix-run/node"
import {
  rolesContainPermission,
  type AuthPermission,
  type AuthRole,
  getPermissionsMap,
} from "~/services/auth/AuthRole"
import type { LoggedInUser } from "./auth.server"
import { getUserIdByEmailOrThrow, userOwnsEntry } from "~/models/user.server"

// export the whole sessionStorage object
export const sessionStorage = createCookieSessionStorage({
  // See documentation at https://github.com/sergiodxa/remix-auth
  cookie: {
    name: "_session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [process.env.COOKIE_SECRET!],
    secure: process.env.NODE_ENV === "production",
  },
})

export const { commitSession, destroySession } = sessionStorage

export const getCookieSession = async (request: Request) => {
  const session = await sessionStorage?.getSession(
    request.headers?.get("Cookie")
  )
  return session
}

export const getReturnHeadersForCookieSession = async ({
  existingSession,
  request,
}: {
  existingSession?: Session
  request?: Request
}) => {
  if (!existingSession && !request) {
    throw new Error(
      `getReturnHeadersForCookieSession: one of existingSession or request must be defined`
    )
  }

  // We can assert that request is not undefined below, because by definition,
  // either existingSession is defined or request is defined (else we would have
  // thrown up above)
  const session = existingSession || (await getCookieSession(request!))
  return {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  }
}

export const getUserFromSession = async (request: Request) => {
  const session = await getCookieSession(request)
  return session?.data?.user as LoggedInUser | undefined
}

export const getUserNameFromSession = async (request: Request) => {
  const user = await getUserFromSession(request)
  const name: string | undefined = user?.name
  return name
}

export const getEmailFromSession = async (request: Request) => {
  const user = await getUserFromSession(request)
  const email: string | undefined = user?.email
  return email
}

export const isUserLoggedIn = async (request: Request) => {
  // TODO: Do a better check. A user could be logged in but could have a blank
  // name.
  const name = await getUserNameFromSession(request)
  return name !== undefined
}

export const getUserRoles = async (request: Request): Promise<AuthRole[]> => {
  const user = await getUserFromSession(request)
  const roles = user?.roles as AuthRole[]
  return roles || []
}

export const getUserPermissions = async (request: Request) => {
  const roles = await getUserRoles(request)
  return getPermissionsMap(roles)
}

export const userHasRole = async (
  request: Request,
  role: AuthRole
): Promise<boolean> => {
  const roles = await getUserRoles(request)
  return roles.includes(role)
}

export const userHasPermission = async (
  request: Request,
  permission: AuthPermission
): Promise<boolean> => {
  const roles = await getUserRoles(request)
  return rolesContainPermission(roles, permission)
}

export const redirectIfUserNotLoggedIn = async (request: Request) => {
  if (!(await isUserLoggedIn(request))) throw redirect(`${LOGIN_PATH}`)
}

export const redirectIfUserLacksPermission = async (
  request: Request,
  permission: AuthPermission
) => {
  if (!(await userHasPermission(request, permission)))
    throw redirect(`${NOT_ALLOWED_PATH}`)
}

export const getUserId = async (request: Request) => {
  const email = await getEmailFromSession(request)
  if (!email) throw json({ message: `No email on user` }, { status: 500 })

  const userId = await getUserIdByEmailOrThrow({ email })
  return userId
}

export const canUserEditEntry = async (
  request: Request,
  headword: string
): Promise<boolean> => {
  // If the user can edit any, then they can edit this one.
  if (await userHasPermission(request, "det:editAny")) return true

  // If the user can't at least edit their own, they can't edit any.
  if (!(await userHasPermission(request, "det:editOwn"))) return false

  // If they can edit their own, they need to own this one.
  if (await userOwnsEntry(request, headword)) return true

  // They're not allowed to edit.
  return false
}
