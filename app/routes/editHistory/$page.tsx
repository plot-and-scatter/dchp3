import { type Prisma } from "@prisma/client"
import { useLoaderData, useParams } from "@remix-run/react"
import { type LoaderArgs } from "@remix-run/server-runtime"
import React from "react"
import { Link } from "~/components/elements/LinksAndButtons/Link"
import Main from "~/components/elements/Main"
import { getAllEntryLogsByPage } from "~/models/user.server"
import { redirectIfUserLacksPermission } from "~/services/auth/session.server"
import { parsePageNumberOrError } from "~/utils/generalUtils"

export async function loader({ request, params }: LoaderArgs) {
  redirectIfUserLacksPermission(request, "det:viewEdits")
  const pageNumber = parsePageNumberOrError(params.page)
  const entryLogs = await getAllEntryLogsByPage(pageNumber)
  return { entryLogs }
}

type loaderData = Prisma.PromiseReturnType<typeof loader>

export default function EditPage() {
  // remix bug - see: https://github.com/remix-run/remix/issues/3931
  const data = useLoaderData<typeof loader>() as unknown as loaderData
  const params = useParams()
  const page = params.page

  const currentPage = page ? parseInt(page) : 1
  const paginationBase = `/editHistory/`

  return (
    <Main center={true}>
      <h1 className="m-5 text-4xl">Edit History, Page: {params.page} </h1>
      <div className="my-2">
        <Link
          className="m-2"
          asButton
          to={`${paginationBase}${currentPage - 1}`}
        >
          Previous page
        </Link>
        <Link
          className="m-2"
          asButton
          to={`${paginationBase}${currentPage + 1}`}
        >
          Next page
        </Link>
      </div>
      <div className="grid grid-cols-12">
        {data.entryLogs.map((e) => {
          return (
            <React.Fragment key={e.id}>
              <Link
                className="col-span-3"
                bold
                to={`/entries/${e.entry?.headword}`}
              >
                {e.entry?.headword ?? `Deleted entry: ${e.entry_id}`}
              </Link>
              <p className="col-span-1"></p>
              <p className="col-span-1">User:</p>
              <p className="col-span-3">{"test user"}</p>
              <p className="col-span-1">Edited:</p>
              <p className="col-span-3">
                {new Date(e.created).toLocaleDateString()}
              </p>
            </React.Fragment>
          )
        })}
      </div>
      <div className="my-2">
        <Link
          className="m-2"
          asButton
          to={`${paginationBase}${currentPage - 1}`}
        >
          Previous page
        </Link>
        <Link
          className="m-2"
          asButton
          to={`${paginationBase}${currentPage + 1}`}
        >
          Next page
        </Link>
      </div>
    </Main>
  )
}
