// A process-level handler for unhandled promise rejections.
//
// Node's default mode is `throw`: an unhandled rejection terminates the
// process. Under `react-router-serve` that means one floating promise
// anywhere in the application takes the whole server down, not just the route
// that produced it. `Restart=always` on the systemd unit brings it back about
// ten seconds later, so the visible symptom is a short 502, then 503s, then
// normal service -- easy to blame on something else.
//
// #456 fixed three loaders that called an async guard without `await`. This
// handler is about the class rather than those three: the next one should be a
// log line to grep for, not an outage.
//
// Deliberately NOT handling `uncaughtException` here. A rejection that nobody
// awaited usually leaves the process in a sane state; an uncaught exception
// unwound a stack partway and may not have. Surviving one warrants its own
// decision, and probably a graceful shutdown rather than carrying on.

export const UNHANDLED_REJECTION_LOG_PREFIX = "[unhandledRejection]"

/**
 * A single line describing what was rejected. Responses get their status and
 * redirect target, because a thrown redirect from an unawaited permission
 * guard is exactly the shape that caused #456 and the useful detail is where
 * it was trying to send the request.
 */
export function describeRejection(reason: unknown): string {
  if (reason instanceof Response) {
    const location = reason.headers.get("location")
    return `Response ${reason.status}${location ? ` -> ${location}` : ""}`
  }

  if (reason instanceof Error) {
    return reason.stack ?? `${reason.name}: ${reason.message}`
  }

  if (typeof reason === "string") return reason

  try {
    // JSON.stringify returns undefined, not a string, for undefined and for a
    // function -- so fall through to String() rather than logging the word
    // "undefined" for two different reasons.
    return JSON.stringify(reason) ?? String(reason)
  } catch {
    return String(reason)
  }
}

let installed = false

/**
 * Register the handler. Idempotent: the server module can be evaluated more
 * than once in development, and listeners accumulating on `process` would
 * multiply every log line and eventually trip Node's max-listeners warning.
 *
 * Returns whether it registered, so a test can assert the second call is a
 * no-op.
 */
export function installUnhandledRejectionHandler(
  target: NodeJS.EventEmitter = process
): boolean {
  if (installed) return false
  installed = true

  target.on("unhandledRejection", (reason: unknown) => {
    // console.error, not a logger: this has to work before anything else is
    // initialised, and the journal is where it needs to land.
    console.error(
      `${UNHANDLED_REJECTION_LOG_PREFIX} ${describeRejection(reason)}`
    )
  })

  return true
}

/** Test-only. Lets a test install onto a stub emitter more than once. */
export function resetUnhandledRejectionHandlerForTests() {
  installed = false
}
