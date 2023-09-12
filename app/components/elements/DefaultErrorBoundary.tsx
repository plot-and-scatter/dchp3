import { isRouteErrorResponse, useRouteError } from "@remix-run/react"

export function DefaultErrorBoundary() {
  const error = useRouteError()

  // when true, this is what used to go to `CatchBoundary`
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <p>Status: {error.status}</p>
        <p>{error.data.message}</p>
      </div>
    )
  }

  // Don't forget to typecheck with your own logic.
  // Any value can be thrown, not just errors!
  let errorMessage = "Unknown error"

  return (
    <div>
      <p>Something went wrong.</p>
      <pre>{errorMessage}</pre>
    </div>
  )
}
