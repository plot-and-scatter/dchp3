import { type LoaderFunctionArgs, redirect } from "@remix-run/server-runtime"
import { DefaultErrorBoundary } from "~/components/elements/DefaultErrorBoundary"

export async function loader({ params }: LoaderFunctionArgs) {
  return redirect(`/editHistory/1`)
}

export const ErrorBoundary = DefaultErrorBoundary
