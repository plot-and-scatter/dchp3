import { type LoaderFunctionArgs, redirect } from "@remix-run/server-runtime"

export async function loader({ params }: LoaderFunctionArgs) {
  return redirect(`/entries/browse/${params.initialLetters}/1`)
}
