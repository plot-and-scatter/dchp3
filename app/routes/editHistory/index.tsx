import { type LoaderFunctionArgs, redirect } from "react-router"
import { DefaultErrorBoundary } from "~/components/elements/DefaultErrorBoundary"
import { throwIfPathBlockedInArchive } from "~/editions/edition.server"

export async function loader({ request }: LoaderFunctionArgs) {
  // Loaders run in parallel, so this redirect would otherwise beat the root
  // loader's 404 in an archive edition.
  throwIfPathBlockedInArchive(request)
  return redirect(`/editHistory/1`)
}

export const ErrorBoundary = DefaultErrorBoundary
