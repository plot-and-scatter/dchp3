import { DefaultErrorBoundary } from "~/components/elements/DefaultErrorBoundary"
import {
  DEFAULT_PAGE_SIZE,
  countEntriesByInitialLetters,
  getEntriesByInitialLettersAndPage,
} from "~/models/entry.server"
import { json } from "@remix-run/node"
import { Link } from "~/components/elements/LinksAndButtons/Link"
import { useLoaderData } from "@remix-run/react"
import invariant from "tiny-invariant"
import type { LoaderArgs } from "@remix-run/node"
import PaginationControl from "~/components/bank/PaginationControl"
import { PageHeader } from "~/components/elements/PageHeader"

export async function loader({ params }: LoaderArgs) {
  const { initialLetters, pageNumber } = params

  invariant(initialLetters, "initialLetters not found")
  invariant(pageNumber, "pageNumber not found")

  const countResult = await countEntriesByInitialLetters(initialLetters)
  const entryCount = Number(countResult[0].count)

  console.log("-->", countResult, entryCount)

  const entries = await getEntriesByInitialLettersAndPage(
    initialLetters,
    pageNumber
  )

  if (!entries) {
    throw new Response("Not Found", { status: 404 })
  }
  return json({
    entries,
    initialLetters,
    pageNumber: +pageNumber,
    entryCount,
    pageCount: Math.ceil(entryCount / DEFAULT_PAGE_SIZE),
  })
}

export default function EntryDetailsPage() {
  const { entries, initialLetters, pageNumber, pageCount, entryCount } =
    useLoaderData<typeof loader>()

  console.log(pageNumber, pageCount)

  const paginationBase = `/entries/browse/${initialLetters}`

  return (
    <div>
      <PageHeader>Entries starting with {initialLetters}</PageHeader>
      <p className="text-center">
        Page {pageNumber} of {pageCount}, {entryCount} entries total
      </p>
      <PaginationControl
        baseLink={`${paginationBase}`}
        currentPage={pageNumber}
        pageCount={pageCount}
      />
      <hr className="my-4" />
      <div className="my-4 flex flex-col gap-y-1">
        {entries.map((e) => (
          <Link to={`/entries/${e.headword}`} bold key={e.id}>
            {e.headword}
          </Link>
        ))}
      </div>
      <hr className="my-4" />
      <PaginationControl
        baseLink={`${paginationBase}`}
        currentPage={pageNumber}
        pageCount={pageCount}
      />
    </div>
  )
}

export const ErrorBoundary = DefaultErrorBoundary
