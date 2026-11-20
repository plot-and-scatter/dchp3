import { data, redirect } from "react-router"
import { BASENAME } from "./basename.server"
import {
  DEFAULT_EDITION,
  EDITION_IDS,
  isArchiveEdition,
  isEditionId,
  isPathBlockedInArchive,
  type EditionId,
} from "./edition"
import { EDITIONS } from "./index"
import { legacyPathRedirect } from "./legacyPaths"

// DCHP_EDITION picks which dictionary this process serves. Unset means
// DCHP-3, so existing deployments need no change. Any other value than the
// three ids is a misconfiguration and fails loudly rather than quietly
// serving the wrong dictionary.
export const getEditionId = (): EditionId => {
  const value = process.env.DCHP_EDITION
  if (value === undefined || value === "") return DEFAULT_EDITION
  if (isEditionId(value)) return value
  throw new Error(
    `DCHP_EDITION must be one of ${EDITION_IDS.join(", ")}; got "${value}"`
  )
}

export const isArchive = () => isArchiveEdition(getEditionId())

// The path inside the app: request.url carries the basename ("/dchp2"),
// and everything that inspects a path works without it.
const appPathOf = (request: Request) => {
  const { pathname } = new URL(request.url)
  return pathname.startsWith(BASENAME)
    ? pathname.slice(BASENAME.length) || "/"
    : pathname
}

// Called from the root loader on every request. An address from the original
// DCHP-1 or DCHP-2 website is answered with a permanent redirect to the page
// that replaced it; see legacyPaths.ts. The redirect target is an app path:
// React Router adds the basename to a loader redirect itself.
export const redirectIfLegacyPath = (request: Request) => {
  const edition = getEditionId()
  const target = legacyPathRedirect(
    appPathOf(request),
    edition,
    Object.keys(EDITIONS[edition].pages)
  )
  if (target) throw redirect(`${target}${new URL(request.url).search}`, 301)
}

// Called from the root loader on every request. In an archive the editing,
// Bank and sign-in routes simply do not exist, so they 404 like any other
// unknown path rather than redirecting to a login page that is itself gone.
export const throwIfPathBlockedInArchive = (request: Request) => {
  if (!isArchive()) return
  if (isPathBlockedInArchive(appPathOf(request))) {
    // The edition rides along so the error page can still show the right
    // title: when the root loader throws, there is no root loader data.
    throw data(
      { message: `Not found`, edition: getEditionId() },
      { status: 404, statusText: "not-found" }
    )
  }
}
