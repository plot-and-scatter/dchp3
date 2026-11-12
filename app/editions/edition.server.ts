import { data } from "react-router"
import {
  DEFAULT_EDITION,
  EDITION_IDS,
  isArchiveEdition,
  isEditionId,
  isPathBlockedInArchive,
  type EditionId,
} from "./edition"

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

// Called from the root loader on every request. In an archive the editing,
// Bank and sign-in routes simply do not exist, so they 404 like any other
// unknown path rather than redirecting to a login page that is itself gone.
export const throwIfPathBlockedInArchive = (request: Request) => {
  if (!isArchive()) return
  const { pathname } = new URL(request.url)
  if (isPathBlockedInArchive(pathname)) {
    // The edition rides along so the error page can still show the right
    // title: when the root loader throws, there is no root loader data.
    throw data(
      { message: `Not found`, edition: getEditionId() },
      { status: 404, statusText: "not-found" }
    )
  }
}
