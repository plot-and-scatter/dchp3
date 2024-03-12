import { Link } from "~/components/elements/LinksAndButtons/Link"
import { getReferences } from "~/models/reference.server"
import { stripHtml } from "~/utils/generalUtils"
import { useLoaderData } from "@remix-run/react"
import SanitizedTextSpan from "~/components/EntryEditor/SanitizedTextSpan"
import { userHasPermission } from "~/services/auth/session.server"
import type { LoaderArgs } from "@remix-run/server-runtime"
import AddIcon from "~/components/elements/Icons/AddIcon"
import EditIcon from "~/components/elements/Icons/EditIcon"
import { PageHeader } from "~/components/elements/Headings/PageHeader"

export async function loader({ request }: LoaderArgs) {
  const references = await getReferences()
  const canUserAddReference = await userHasPermission(
    request,
    "det:editReferences"
  )

  return { references, canUserAddReference }
}

export default function ReferenceIndexPage() {
  const { references, canUserAddReference } = useLoaderData<typeof loader>()

  const options: Intl.CollatorOptions = {
    sensitivity: "base",
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader>References</PageHeader>
      {canUserAddReference && (
        <Link
          asButton
          to="add-reference"
          className="w-fit"
          appearance="success"
        >
          <AddIcon /> Add new reference
        </Link>
      )}
      <div className="flex flex-col">
        {references
          .sort((a, b) => {
            const first = stripHtml(a.short_display)
            const second = stripHtml(b.short_display)
            return first.localeCompare(second, "en", options)
          })
          .map((e) => (
            <div className="flex gap-x-2 py-1 hover:bg-gray-100" key={e.id}>
              {canUserAddReference && (
                <Link bold className="w-20 shrink-0" to={`/references/${e.id}`}>
                  <EditIcon /> Edit
                </Link>
              )}
              <div className="w-48 shrink-0 break-words font-bold">
                <SanitizedTextSpan text={e.short_display} />
              </div>
              <div className="">
                <SanitizedTextSpan text={e.reference_text} />
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
