import type { LinksFunction, MetaFunction } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react"

import smartquotes from "smartquotes"
import { useEffect } from "react"

import tailwindStylesheetUrl from "./styles/tailwind.css"
import additionalStylesUrl from "./styles/additional.css"

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

export default function App() {
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
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
