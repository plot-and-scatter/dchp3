import { DefaultErrorBoundary } from "~/components/elements/DefaultErrorBoundary"
import { getEntriesByInitialLettersAndPage } from "~/models/entry.server"
import { json } from "@remix-run/node"
import { DchpLink } from "~/components/elements/LinksAndButtons/Link"
import { useLoaderData } from "@remix-run/react"
import invariant from "tiny-invariant"
import type { LoaderArgs } from "@remix-run/node"

export async function loader({ params }: LoaderArgs) {
  const { initialLetters, pageNumber } = params

  invariant(initialLetters, "initialLetters not found")
  invariant(pageNumber, "pageNumber not found")

  const entries = await getEntriesByInitialLettersAndPage(
    initialLetters,
    pageNumber
  )

  if (!entries) {
    throw new Response("Not Found", { status: 404 })
  }
  return json({ entries, initialLetters, pageNumber })
}

export default function EntryDetailsPage() {
  const { entries, initialLetters, pageNumber } = useLoaderData<typeof loader>()

  const currentPage = pageNumber ? parseInt(pageNumber) : 1
  const paginationBase = `/entries/browse/${initialLetters}/`

  return (
    <div>
      <h3 className="text-2xl font-bold">
        Entries starting with {initialLetters}: {entries.length} (Page{" "}
        {pageNumber})
      </h3>
      <div className="my-4 flex flex-col gap-y-1">
        {entries.map((e) => (
          <DchpLink to={`/entries/${e.headword}`} bold key={e.id}>
            {e.headword}
          </DchpLink>
        ))}
      </div>
      <div className="flex gap-x-4">
        <DchpLink asButton to={`${paginationBase}${currentPage - 1}`}>
          Previous page
        </DchpLink>
        <DchpLink asButton to={`${paginationBase}${currentPage + 1}`}>
          Next page
        </DchpLink>
      </div>
    </div>
  )
}

export const ErrorBoundary = DefaultErrorBoundary
