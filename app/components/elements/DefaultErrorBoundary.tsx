import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "@remix-run/react"
import { Link } from "./LinksAndButtons/Link"
import Button from "./LinksAndButtons/Button"

export function DefaultErrorBoundary() {
  const error = useRouteError()
  const navigate = useNavigate()

  // when true, this is what used to go to `CatchBoundary`
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <p>Status {error.status}</p>
        <p className="text-xl">{error.data.message || error.data}</p>
        <div className="mt-8 flex gap-x-8">
          <Button onClick={() => navigate(-1)} variant="outline">
            &larr; Return to previous screen
          </Button>
          <Link to={"/"} asButton buttonVariant="outline">
            Go to the DCHP-3 homepage &rarr;
          </Link>
        </div>
      </div>
    )
  }

  // Don't forget to typecheck with your own logic.
  // Any value can be thrown, not just errors!
  let errorMessage = (error as any)?.toString() || "Unknown error"

  console.log(error)

  return (
    <div>
      <p>Something went wrong.</p>
      <pre>{errorMessage}</pre>
    </div>
  )
}
