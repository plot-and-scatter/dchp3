import type { LoaderArgs } from "@remix-run/server-runtime"

export const loader = ({ request }: LoaderArgs) => {
  console.log("FAILURE", request)

  return {}
}

export default function Failure() {
  return <>Error occurred.</>
}
