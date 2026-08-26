import { Fragment } from "react"
export default function DraftLabel({ isPublic }: { isPublic: boolean }) {
  return isPublic ? (
    <Fragment></Fragment>
  ) : (
    <span className="ml-1 bg-alert-200 px-1 py-0.5 text-xs uppercase">
      Draft
    </span>
  )
}
