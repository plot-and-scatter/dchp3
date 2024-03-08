import { Link } from "~/components/elements/LinksAndButtons/Link"
import { getReferences } from "~/models/reference.server"
import { stripHtml } from "~/utils/generalUtils"
import { useLoaderData } from "@remix-run/react"
import SanitizedTextSpan from "~/components/SanitizedTextSpan"
import { userHasPermission } from "~/services/auth/session.server"
import type { LoaderArgs } from "@remix-run/server-runtime"

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
    <div className="flex flex-col">
      {canUserAddReference && (
        <Link asButton to="add-reference" className="w-fit">
          Add new reference
        </Link>
      )}
      <div className="my-8 grid grid-cols-7 justify-start gap-x-4">
        {references
          .sort((a, b) => {
            const first = stripHtml(a.short_display)
            const second = stripHtml(b.short_display)
            return first.localeCompare(second, "en", options)
          })
          .map((e) => (
            <>
              <p className="col-span-1 break-words font-bold">
                <SanitizedTextSpan text={e.short_display} />
              </p>
              <p className="col-span-5">
                <SanitizedTextSpan text={e.reference_text} />
              </p>
              <div className="col-span-1">
                {canUserAddReference && (
                  <Link bold className="col-span-1" to={`/references/${e.id}`}>
                    Edit
                  </Link>
                )}
              </div>
            </>
          ))}
      </div>
    </div>
  )
}
