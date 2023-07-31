import { createCookieSessionStorage, redirect } from "@remix-run/node"
import { LOGIN_PATH } from "utils/paths"
import type { Session } from "@remix-run/node"

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

export const getUserNameFromSession = async (request: Request) => {
  const session = await getCookieSession(request)
  const name: string | undefined = session?.data?.user?.name
  return name
}

export const getEmailFromSession = async (request: Request) => {
  const session = await getCookieSession(request)
  const email: string | undefined = session?.data?.user?.email
  return email
}

export const isUserLoggedIn = async (request: Request) => {
  // TODO: Do a better check. A user could be logged in but could have a blank
  // name.
  const name = await getUserNameFromSession(request)
  return name !== undefined
}

export const redirectIfUserNotLoggedIn = async (request: Request) => {
  if (!(await isUserLoggedIn(request))) throw redirect(`${LOGIN_PATH}`)
}
