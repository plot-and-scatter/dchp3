import { DefaultErrorBoundary } from "~/components/elements/DefaultErrorBoundary"
import {
  countEntriesByInitialLetters,
  getEntriesByInitialLettersAndPage,
} from "~/models/entry.server"
import { json } from "@remix-run/node"
import { Link } from "~/components/elements/LinksAndButtons/Link"
import { useLoaderData } from "@remix-run/react"
import invariant from "tiny-invariant"
import type { LoaderArgs } from "@remix-run/node"
import PaginationControl from "~/components/bank/PaginationControl"
import { PageHeader } from "~/components/elements/Headings/PageHeader"
import { userHasPermission } from "~/services/auth/session.server"
import DraftLabel from "~/components/elements/Labels/DraftLabel"
import { DEFAULT_PAGE_SIZE } from "~/utils/pageSize"

export async function loader({ request, params }: LoaderArgs) {
  const { initialLetters, pageNumber } = params

  invariant(initialLetters, "initialLetters not found")
  invariant(pageNumber, "pageNumber not found")

  const isUserAdmin = await userHasPermission(request, "det:viewEdits")

  const countResult = await countEntriesByInitialLetters(
    initialLetters,
    isUserAdmin
  )
  const entryCount = Number(countResult[0].count)

  const entries = await getEntriesByInitialLettersAndPage(
    initialLetters,
    pageNumber,
    isUserAdmin
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
          <p key={e.id} className="flex items-center">
            <Link to={`/entries/${e.headword}`} bold key={e.id}>
              {e.headword}
            </Link>
            <DraftLabel isPublic={e.is_public} />
          </p>
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
