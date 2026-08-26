import { type LoaderFunctionArgs, redirect } from "react-router"

export async function loader({ params }: LoaderFunctionArgs) {
  return redirect(`/entries/browse/${params.initialLetters}/1`)
}
