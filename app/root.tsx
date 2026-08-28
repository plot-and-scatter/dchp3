import type {
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "react-router"
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteLoaderData,
} from "react-router"

import smartquotes from "smartquotes"
import { useEffect } from "react"

import tailwindStylesheetUrl from "./styles/tailwind.css?url"
import additionalStylesUrl from "./styles/additional.css?url"
import Header from "./components/elements/Layouts/Header"
import Nav from "./components/elements/Layouts/Nav"
import { getUserFromSession } from "./services/auth/session.server"
import { DefaultErrorBoundary } from "./components/elements/DefaultErrorBoundary"
import type { LoggedInUser } from "./services/auth/auth.server"
import TextPageMain from "./components/elements/Layouts/TextPageMain"

export const BASE_APP_TITLE = "DCHP-3"

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    { rel: "stylesheet", href: additionalStylesUrl },
    {
      rel: "stylesheet",
      href: "https://kit.fontawesome.com/178b0761ed.css",
      crossOrigin: "anonymous",
    },
  ]
}

export const meta: MetaFunction = () => [{ title: BASE_APP_TITLE }]

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUserFromSession(request)
  return { user, isStaging: process.env.DEPLOYMENT_ENV === "staging" }
}

const defaultApp = ({
  user,
  error,
  isStaging,
}: {
  user: LoggedInUser | undefined
  error?: boolean
  isStaging?: boolean
}) => {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />

        {/* <script
          src="https://kit.fontawesome.com/178b0761ed.js"
          crossOrigin="anonymous"
        ></script> */}
      </head>
      <body className="h-full">
        <div className="relative">
          <Header isStaging={isStaging} />
          <Nav user={user} />
          {error ? (
            <TextPageMain>
              <DefaultErrorBoundary />
            </TextPageMain>
          ) : (
            <Outlet />
          )}
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  const { user, isStaging } = useLoaderData<typeof loader>()

  useEffect(() => {
    smartquotes().listen()
  }, [])

  return defaultApp({ user, isStaging })
}

export function ErrorBoundary() {
  // The root loader's data is still available on error pages unless the
  // loader itself threw.
  const data = useRouteLoaderData<typeof loader>("root")
  return defaultApp({ user: undefined, error: true, isStaging: data?.isStaging })
}
