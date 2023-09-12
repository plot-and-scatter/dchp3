import { DefaultErrorBoundary } from "~/components/elements/DefaultErrorBoundary"

export async function loader() {
  return null
}

export default function BankStatistics() {
  return (
    <div>
      <h3 className="text-2xl font-bold">Bank Statistics</h3>
    </div>
  )
}

export const ErrorBoundary = DefaultErrorBoundary
