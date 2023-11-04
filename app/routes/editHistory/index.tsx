import { type LoaderArgs, redirect } from "@remix-run/server-runtime"
import { DefaultErrorBoundary } from "~/components/elements/DefaultErrorBoundary"

export async function loader({ params }: LoaderArgs) {
  return redirect(`/editHistory/1`)
}

export const ErrorBoundary = DefaultErrorBoundary
