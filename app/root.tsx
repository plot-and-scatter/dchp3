import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react"

import smartquotes from "smartquotes"
import { useEffect } from "react"

import tailwindStylesheetUrl from "./styles/tailwind.css"
import additionalStylesUrl from "./styles/additional.css"
import Header from "./components/elements/Header"
import Nav from "./components/elements/Nav"
import { getUserFromSession } from "./services/auth/session.server"

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    { rel: "stylesheet", href: additionalStylesUrl },
  ]
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "DCHP-3",
  viewport: "width=device-width,initial-scale=1",
})

export async function loader({ request }: LoaderArgs) {
  const user = await getUserFromSession(request)
  return { user }
}

export default function App() {
  const { user } = useLoaderData<typeof loader>()

  useEffect(() => {
    smartquotes().listen()
  }, [])

  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
        <script
          src="https://kit.fontawesome.com/178b0761ed.js"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className="h-full">
        <div className="relative">
          <Header />
          <Nav user={user} />
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
