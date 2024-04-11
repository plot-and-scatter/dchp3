export default function DraftLabel({ isPublic }: { isPublic: boolean }) {
  return isPublic ? (
    <></>
  ) : (
    <span className="ml-1 bg-alert-200 px-1 py-0.5 text-xs uppercase">
      Draft
    </span>
  )
}
