// A headword collided with one already in the database. Carried as a tagged
// Error so a route action can recognise it and *return* a message rather than
// letting it reach the error boundary, which would tear the form down.
//
// Tagged structurally rather than with a class + `instanceof`, so route modules
// can identify it without a runtime import of any module that reaches Prisma.
// This file deliberately imports nothing.

const HEADWORD_CONFLICT = "HeadwordConflict" as const

type HeadwordConflictError = Error & { kind: typeof HEADWORD_CONFLICT }

export function headwordConflictError(message: string): HeadwordConflictError {
  return Object.assign(new Error(message), { kind: HEADWORD_CONFLICT })
}

export function isHeadwordConflictError(
  error: unknown
): error is HeadwordConflictError {
  return (
    error instanceof Error &&
    (error as Partial<HeadwordConflictError>).kind === HEADWORD_CONFLICT
  )
}
