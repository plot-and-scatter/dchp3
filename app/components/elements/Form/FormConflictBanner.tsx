import { Fragment } from "react"

// Headword conflicts are reported by *returning* a message from the action
// rather than throwing one. Throwing renders the error boundary, which tears
// down the form and loses whatever else the editor had typed; returning leaves
// the page mounted so only this banner appears. Both the insert and the edit
// routes report conflicts this shape, so they behave the same way.
export type FormConflict = { conflictMessage: string }

export const isFormConflict = (
  actionData: unknown
): actionData is FormConflict =>
  typeof actionData === "object" &&
  actionData !== null &&
  typeof (actionData as FormConflict).conflictMessage === "string"

export default function FormConflictBanner({
  actionData,
}: {
  actionData: unknown
}) {
  if (!isFormConflict(actionData)) return <Fragment />

  return (
    <div
      role="alert"
      className="border-primary-dark bg-primary-lightest text-primary-dark my-4 border px-4 py-3"
    >
      {actionData.conflictMessage}
    </div>
  )
}
