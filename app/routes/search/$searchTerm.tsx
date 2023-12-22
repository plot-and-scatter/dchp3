import {
  Form,
  useLoaderData,
  useParams,
  useSearchParams,
} from "@remix-run/react"
import { DefaultErrorBoundary } from "~/components/elements/DefaultErrorBoundary"
import { redirect } from "@remix-run/node"
import { SecondaryHeader } from "~/components/elements/SecondaryHeader"
import { type AllSearchResults, getSearchResults } from "~/models/search.server"
import invariant from "tiny-invariant"
import SearchResults from "~/components/SearchResults"
import type { ActionArgs, LoaderArgs } from "@remix-run/node"

export async function action({ request, params }: ActionArgs) {
  const data = Object.fromEntries(await request.formData())

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

  const canadianismTypes: string[] | undefined =
    url.searchParams.getAll("canadianismType")

  console.log(
    "####",
    caseSensitive,
    text,
    pageNumber,
    dchpVersions,
    canadianismTypes
  )

  const searchResults: AllSearchResults = await getSearchResults(
    text,
    pageNumber,
    caseSensitive,
    undefined,
    dchpVersions,
    canadianismTypes
  )

  return searchResults
}

export default function EntryDetailsPage() {
  const data: AllSearchResults = useLoaderData<typeof loader>()
  const params = useParams()
  const [searchParams] = useSearchParams()
  invariant(params.searchTerm)

  return (
    <div className="mt-5 w-full border-t-2 border-gray-500 pt-5 lg:w-fit">
      <SecondaryHeader>
        Search results for &ldquo;{params.searchTerm}&rdquo;
        {searchParams.get("caseSensitive") !== "undefined" && (
          <> (case sensitive)</>
        )}
      </SecondaryHeader>
      <Form method="post" className="w-full">
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
