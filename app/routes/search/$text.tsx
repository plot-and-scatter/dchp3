import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { Form, useCatch, useLoaderData, useParams } from "@remix-run/react"
import invariant from "tiny-invariant"
import SearchResults from "~/components/SearchResults"

import {} from "~/models/entry.server"
import { getSearchResultsByPage } from "~/models/search.server"

export async function action({ request, params }: ActionArgs) {
  const data = Object.fromEntries(await request.formData())
  const pageIncrement = data.nextPage === "true" ? 1 : -1

  const url = new URL(request.url)

  const pageNumber: string = url.searchParams.get("pageNumber") ?? "1"

  let nextPageNumber = parseInt(pageNumber) + pageIncrement
  nextPageNumber = nextPageNumber >= 1 ? nextPageNumber : 1

  url.searchParams.set("pageNumber", nextPageNumber.toString())

  return redirect(url.toString())
}

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.text, "text not found")

  const url = new URL(request.url)
  const caseSensitive: boolean =
    url.searchParams.get("caseSensitive") === "true"
  const pageNumber: string | undefined =
    url.searchParams.get("pageNumber") ?? undefined

  const everything = await getSearchResultsByPage(
    params.text,
    pageNumber,
    caseSensitive
  )

  if (!everything) {
    throw new Response("Not Found", { status: 404 })
  }
  return everything
}

export default function EntryDetailsPage() {
  const data: Record<string, any[]> = useLoaderData<typeof loader>()
  const params = useParams()
  invariant(params.text)

  return (
    <>
      <SearchResults
        data={data}
        text={params.text}
        pageNumber={params.pageNumber}
      />
      <Form reloadDocument method="post">
        <button
          className="mx-3 border border-slate-600 bg-slate-500 p-2 text-white hover:bg-slate-400"
          type="submit"
          name="nextPage"
          value="false"
        >
          Prev Page
        </button>
        <button
          className="mx-3 border border-slate-600 bg-slate-500 p-2 text-white hover:bg-slate-400"
          type="submit"
          name="nextPage"
          value="true"
        >
          Next Page
        </button>
      </Form>
    </>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error)

  return <div>An unexpected error occurred: {error.message}</div>
}

export function CatchBoundary() {
  const caught = useCatch()

  if (caught.status === 404) {
    return <div>Entry not found</div>
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`)
}
