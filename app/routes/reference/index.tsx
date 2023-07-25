import { Link, useLoaderData } from "@remix-run/react"
import { type LoaderArgs } from "@remix-run/server-runtime"
import SanitizedTextSpan from "~/components/SanitizedTextSpan"
import { getReferences } from "~/models/reference.server"
import { stripHtml } from "~/utils/generalUtils"

export async function loader({ params }: LoaderArgs) {
  return await getReferences()
}

export default function ReferenceIndexPage() {
  const data = useLoaderData<typeof loader>()

  const options: Intl.CollatorOptions = {
    sensitivity: "base",
  }

  return (
    <div className="grid- container m-5 grid grid-cols-7 justify-start">
      {data
        .sort((a, b) => {
          const first = stripHtml(a.short_display)
          const second = stripHtml(b.short_display)
          return first.localeCompare(second, "en", options)
        })
        .map((e) => {
          return (
            <>
              <p className="col-span-1 mx-4 w-36 break-words">
                <SanitizedTextSpan text={e.short_display} />
              </p>
              <p className="col-span-5">
                <SanitizedTextSpan text={e.reference_text} />
              </p>
              <Link className="col-span-1 ml-10" to={`/reference/${e.id}`}>
                <p className="w-fit underline hover:bg-blue-200">edit</p>
              </Link>
            </>
          )
        })}
    </div>
  )
}
