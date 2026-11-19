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
  isRouteErrorResponse,
  useLoaderData,
  useLocation,
  useRouteError,
  useRouteLoaderData,
} from "react-router"

import smartquotes from "smartquotes"
import { Fragment, useEffect } from "react"

import tailwindStylesheetUrl from "./styles/tailwind.css?url"
import additionalStylesUrl from "./styles/additional.css?url"
import Header from "./components/elements/Layouts/Header"
import Nav from "./components/elements/Layouts/Nav"
import { getUserFromSession } from "./services/auth/session.server"
import { DefaultErrorBoundary } from "./components/elements/DefaultErrorBoundary"
import type { LoggedInUser } from "./services/auth/auth.server"
import TextPageMain from "./components/elements/Layouts/TextPageMain"
import {
  getEditionId,
  throwIfPathBlockedInArchive,
} from "./editions/edition.server"
import {
  DEFAULT_EDITION,
  isEditionId,
  type EditionId,
} from "./editions/edition"
import { EDITIONS, type EditionConfig } from "./editions"

// An archive edition's page colour, plus its replacements for the five light
// greys that tailwind.config.js resolves through --gray-* (defaults in
// additional.css). Undefined for DCHP-3, so <body> gets no style.
function tintStyle(
  tints: EditionConfig["tints"]
): React.CSSProperties | undefined {
  if (!tints) return undefined
  return {
    backgroundColor: tints.page,
    "--gray-50": tints[50],
    "--gray-100": tints[100],
    "--gray-200": tints[200],
    "--gray-300": tints[300],
    "--gray-400": tints[400],
  } as React.CSSProperties
}

// The DCHP-3 title. Routes that build a page title use the edition's own
// short name via the root loader; this stays for the one or two places that
// have no loader data to hand (and for DCHP-3 it is the same string).
export const BASE_APP_TITLE = EDITIONS[DEFAULT_EDITION].shortName

// The name search engines show above a result ("site name"). Google keeps
// one per hostname, and all three editions are served from the same
// hostname, so it is the dictionary's name without an edition number.
export const SITE_NAME = "DCHP"
const SITE_URL = "https://dchp.arts.ubc.ca/"

// Google reads the site name from WebSite structured data on the hostname's
// home page, which is the DCHP-3 home page. og:site_name goes on every page
// of every edition. Both are rendered here and not in `meta`, because a
// route's own `meta` export replaces the root's.
const SiteNameTags = ({ edition }: { edition: EditionId }) => {
  const isSiteHomePage =
    useLocation().pathname === "/" && edition === DEFAULT_EDITION
  return (
    <Fragment>
      <meta property="og:site_name" content={SITE_NAME} />
      {isSiteHomePage && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: SITE_NAME,
              alternateName: [
                "Dictionary of Canadianisms on Historical Principles",
              ],
              url: SITE_URL,
            }),
          }}
        />
      )}
    </Fragment>
  )
}

// Each edition has its own favicon colour: red for DCHP-3, and the header
// bar's colour for an archive. All three editions share one hostname, and a
// browser with no tag to follow asks for /favicon.ico at the root of the
// hostname, which is DCHP-3's. So the tags name the file, under the path the
// edition is served from (BASE_URL is "/", "/dchp1/" or "/dchp2/").
const FaviconTags = ({ edition }: { edition: EditionId }) => {
  const suffix = edition === DEFAULT_EDITION ? "" : `-${edition}`
  const base = import.meta.env.BASE_URL
  return (
    <Fragment>
      <link rel="icon" href={`${base}favicon${suffix}.ico`} sizes="48x48" />
      <link
        rel="apple-touch-icon"
        href={`${base}apple-touch-icon${suffix}.png`}
      />
    </Fragment>
  )
}

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

// The edition for the title comes from the loader, or, on an error page
// where the root loader itself threw, from the thrown response.
const editionFromError = (error: unknown): EditionId | undefined =>
  isRouteErrorResponse(error) && isEditionId(error.data?.edition)
    ? error.data.edition
    : undefined

export const meta: MetaFunction<typeof loader> = ({ data, error }) => [
  {
    title:
      EDITIONS[data?.edition ?? editionFromError(error) ?? DEFAULT_EDITION]
        .shortName,
  },
]

export async function loader({ request }: LoaderFunctionArgs) {
  // In an archive edition the sign-in, Bank and editing routes do not exist.
  throwIfPathBlockedInArchive(request)
  const edition: EditionId = getEditionId()
  const user = await getUserFromSession(request)
  return {
    user,
    edition,
    isStaging: process.env.DEPLOYMENT_ENV === "staging",
  }
}

const defaultApp = ({
  user,
  error,
  isStaging,
  edition,
}: {
  user: LoggedInUser | undefined
  error?: boolean
  isStaging?: boolean
  edition: EditionId
}) => {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <SiteNameTags edition={edition} />
        <FaviconTags edition={edition} />
        <Links />

        {/* <script
          src="https://kit.fontawesome.com/178b0761ed.js"
          crossOrigin="anonymous"
        ></script> */}
      </head>
      {/* tintStyle re-points gray-50..400 at the edition's tints; see
          "Archive editions" in additional.css. */}
      <body
        className="h-full"
        style={tintStyle(EDITIONS[edition].tints)}
      >
        <div className="relative">
          <Header isStaging={isStaging} edition={edition} />
          <Nav user={user} edition={edition} />
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
  const { user, isStaging, edition } = useLoaderData<typeof loader>()

  useEffect(() => {
    smartquotes().listen()
  }, [])

  return defaultApp({ user, isStaging, edition })
}

export function ErrorBoundary() {
  // The root loader's data is still available on error pages unless the
  // loader itself threw.
  const data = useRouteLoaderData<typeof loader>("root")
  // When the root loader itself threw (an archive 404), the edition comes
  // with the thrown response instead.
  const thrownEdition = editionFromError(useRouteError())
  return defaultApp({
    user: undefined,
    error: true,
    isStaging: data?.isStaging,
    edition: data?.edition ?? thrownEdition ?? DEFAULT_EDITION,
  })
}
