import { type Prisma } from "@prisma/client"
import { Form, useLoaderData, useParams } from "@remix-run/react"
import {
  redirect,
  type ActionArgs,
  type LoaderArgs,
} from "@remix-run/server-runtime"
import React from "react"
import invariant from "tiny-invariant"
import { DefaultErrorBoundary } from "~/components/elements/DefaultErrorBoundary"
import Button from "~/components/elements/LinksAndButtons/Button"
import { Link } from "~/components/elements/LinksAndButtons/Link"
import Main from "~/components/elements/Layouts/Main"
import { getAllEntryLogsByPage } from "~/models/user.server"
import { redirectIfUserLacksPermission } from "~/services/auth/session.server"
import {
  getStringFromFormInput,
  parsePageNumberOrError,
} from "~/utils/generalUtils"

export async function action({ request }: ActionArgs) {
  const data = Object.fromEntries(await request.formData())
  invariant(data.orderBy)

  const url = `/editHistory/1`

  const searchParams = new URLSearchParams()
  searchParams.set("orderBy", getStringFromFormInput(data.orderBy))

  return redirect(`${url}?${searchParams.toString()}`)
}

export async function loader({ request, params }: LoaderArgs) {
  redirectIfUserLacksPermission(request, "det:viewEdits")
  const pageNumber = parsePageNumberOrError(params.page)

  const url = new URL(request.url)
  const orderBy: string = url.searchParams.get("orderBy") ?? "desc"

  const entryLogs = await getAllEntryLogsByPage(pageNumber, orderBy)
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
      <Form method="post" className="mb-5">
        <h2 className="text-2xl">Search</h2>
        <label>
          Sort by:
          <select name="orderBy">
            <option value="desc"> Descending</option>
            <option value="asc"> Ascending</option>
          </select>
        </label>
        <Button size="small"> Search</Button>
      </Form>
      <div className="mb-6">
        <Link
          className="m-2"
          asButton
          to={`${paginationBase}${Math.max(currentPage - 1, 1)}`}
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
      <div className="grid grid-cols-10 gap-x-2">
        {data.entryLogs.map((e) => {
          return (
            <React.Fragment key={e.id}>
              <Link
                className="col-span-3"
                bold
                to={`/entries/${e.entry?.headword}`}
              >
                {e.entry?.headword ?? `[Deleted entry]: ${e.headword}`}
              </Link>
              <p className="col-span-3">
                User:{" "}
                <Link to={`/profile/${e.user?.email}`}>
                  {e.user?.first_name + " " + e.user?.last_name}
                </Link>
              </p>
              <p className="col-span-2">
                Edited: {new Date(e.created).toLocaleDateString()}
              </p>
            </React.Fragment>
          )
        })}
      </div>
      <div className="my-2">
        <Link
          className="m-2"
          asButton
          to={`${paginationBase}${Math.max(currentPage - 1, 1)}`}
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

export const ErrorBoundary = DefaultErrorBoundary
