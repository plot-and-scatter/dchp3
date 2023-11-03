import { redirect } from "@remix-run/server-runtime"

export const loader = async () => {
  return redirect("/bank/own/1")
}
