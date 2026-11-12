import { redirect, type LoaderFunctionArgs } from "react-router"
import { throwIfPathBlockedInArchive } from "~/editions/edition.server"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Loaders run in parallel, so this redirect would otherwise beat the root
  // loader's 404 in an archive edition.
  throwIfPathBlockedInArchive(request)
  return redirect("/bank/own/1")
}
