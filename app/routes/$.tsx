import { data, type LoaderFunctionArgs } from "react-router"
import { DefaultErrorBoundary } from "~/components/elements/DefaultErrorBoundary"
import { getEditionId } from "~/editions/edition.server"

// Catch-all for URLs that match no route. Without it React Router throws its
// own 404 before any loader runs, so the error page has no root loader data
// and shows the default edition's title; with it, the root loader has run
// and the edition rides along in the thrown data as well.
export async function loader(_args: LoaderFunctionArgs) {
  throw data(
    { message: "Not found", edition: getEditionId() },
    { status: 404, statusText: "not-found" }
  )
}

export default function CatchAll() {
  return null
}

export const ErrorBoundary = DefaultErrorBoundary
