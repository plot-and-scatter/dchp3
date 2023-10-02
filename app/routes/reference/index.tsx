import { Link } from "~/components/elements/LinksAndButtons/Link"
import { getReferences } from "~/models/reference.server"
import { stripHtml } from "~/utils/generalUtils"
import { useLoaderData } from "@remix-run/react"
import SanitizedTextSpan from "~/components/SanitizedTextSpan"

export async function loader() {
  return await getReferences()
}

export default function ReferenceIndexPage() {
  const data = useLoaderData<typeof loader>()

  const options: Intl.CollatorOptions = {
    sensitivity: "base",
  }

  return (
    <div className="flex flex-col">
      <Link asButton to="addReference" className="w-fit">
        Add new reference
      </Link>
      <div className="my-8 grid grid-cols-7 justify-start gap-x-4">
        {data
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
              <Link bold className="col-span-1" to={`/reference/${e.id}`}>
                Edit
              </Link>
            </>
          ))}
      </div>
    </div>
  )
}
