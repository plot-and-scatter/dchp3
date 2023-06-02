import { type LoaderArgs, redirect } from "@remix-run/server-runtime"

export async function loader({ params }: LoaderArgs) {
  return redirect(`/entries/browse/${params.initialLetters}/1`)
}
