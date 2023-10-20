import {
  Form,
  useLoaderData,
  useParams,
  useSearchParams,
} from "@remix-run/react"
import { DefaultErrorBoundary } from "~/components/elements/DefaultErrorBoundary"
import { redirect } from "@remix-run/node"
import { type AllSearchResults, getSearchResults } from "~/models/search.server"
import invariant from "tiny-invariant"
import SearchResults from "~/components/SearchResults"
import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import { SecondaryHeader } from "~/components/elements/SecondaryHeader"

export async function action({ request, params }: ActionArgs) {
  const data = Object.fromEntries(await request.formData())

  console.log("dddddata", data)

  const pageIncrement = data.nextPage === "true" ? 1 : -1

  const url = new URL(request.url)

  const pageNumber: string = url.searchParams.get("pageNumber") ?? "1"

  let nextPageNumber = parseInt(pageNumber) + pageIncrement
  nextPageNumber = nextPageNumber >= 1 ? nextPageNumber : 1

  url.searchParams.set("pageNumber", nextPageNumber.toString())

  // Also set the attribute, if the user clicked one of those buttons.
  const attribute = data.attribute
  if (attribute) {
    url.searchParams.set("attribute", String(attribute))
  }

  return redirect(url.toString())
}

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.searchTerm, "searchTerm not found")
  const text = params.searchTerm

  const url = new URL(request.url)
  const caseSensitive: boolean =
    url.searchParams.get("caseSensitive") === "true"
  const pageNumber: string | undefined =
    url.searchParams.get("pageNumber") ?? undefined
  const dchpVersions: string[] | undefined = url.searchParams.getAll("database")

  console.log("####", caseSensitive, text, pageNumber, dchpVersions)

  const searchResults: AllSearchResults = await getSearchResults(
    text,
    pageNumber,
    caseSensitive,
    undefined,
    dchpVersions
  )

  return searchResults
}

export default function EntryDetailsPage() {
  const data: AllSearchResults = useLoaderData<typeof loader>()
  const params = useParams()
  const [searchParams] = useSearchParams()
  invariant(params.searchTerm)

  return (
    <div className="mt-5 w-fit border-t-2 border-slate-500 pt-5">
      <SecondaryHeader>
        Search results for &ldquo;{params.searchTerm}&rdquo;
      </SecondaryHeader>
      <Form method="post">
        <SearchResults
          data={data}
          text={params.searchTerm}
          pageNumber={searchParams.get("pageNumber")}
          searchAttribute={searchParams.get("attribute")}
        />
      </Form>
    </div>
  )
}

export const ErrorBoundary = DefaultErrorBoundary
