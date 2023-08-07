import type { LoaderArgs } from "@remix-run/node"
import { useCatch, useLoaderData } from "@remix-run/react"

export async function loader({ request, params }: LoaderArgs) {
  return {}
}

export default function BankStatistics() {
  const data = useLoaderData<typeof loader>()

  console.log("data", data)

  return (
    <div>
      <h3 className="text-2xl font-bold">Bank Statistics</h3>
    </div>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error)

  return <div>An unexpected error occurred: {error.message}</div>
}

export function CatchBoundary() {
  const caught = useCatch()

  if (caught.status === 404) {
    return <div>Entry not found</div>
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`)
}
