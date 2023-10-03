import {
  Form,
  useLoaderData,
  useParams,
  useSearchParams,
} from "@remix-run/react"
import { DefaultErrorBoundary } from "~/components/elements/DefaultErrorBoundary"
import { type AllSearchResults, getSearchResults } from "~/models/search.server"
import { redirect } from "@remix-run/node"
import invariant from "tiny-invariant"
import SearchResults from "~/components/SearchResults"
import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import Button from "~/components/elements/LinksAndButtons/Button"

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
  const text = params.text

  const url = new URL(request.url)
  const caseSensitive: boolean =
    url.searchParams.get("caseSensitive") === "true"
  const pageNumber: string | undefined =
    url.searchParams.get("pageNumber") ?? undefined

  const searchResults: AllSearchResults = await getSearchResults(
    text,
    pageNumber,
    caseSensitive
  )

  if (!searchResults || isEmpty(searchResults)) {
    throw new Response(null, {
      status: 404,
      statusText: `No Results Found for "${text}"`,
    })
  }
  return searchResults
}

function isEmpty(searchResults: AllSearchResults) {
  let isEmpty = true
  for (var elm of Object.values(searchResults)) {
    console.log(elm.length)
    if (elm.length !== 0) isEmpty = false
  }
  return isEmpty
}

export default function EntryDetailsPage() {
  const data: AllSearchResults = useLoaderData<typeof loader>()
  const params = useParams()
  const [searchParams] = useSearchParams()
  invariant(params.text)

  return (
    <>
      <Form reloadDocument method="post">
        <Button type="submit" className="mx-2" name="nextPage" value="false">
          Previous page
        </Button>
        <Button type="submit" className="mx-2" name="nextPage" value="true">
          Next page
        </Button>
      </Form>
      <SearchResults
        data={data}
        text={params.text}
        pageNumber={params.pageNumber}
        searchAttribute={searchParams.get("attribute")}
      />
      <Form reloadDocument method="post">
        <Button type="submit" className="mx-2" name="nextPage" value="false">
          Previous page
        </Button>
        <Button type="submit" className="mx-2" name="nextPage" value="true">
          Next page
        </Button>
      </Form>
    </>
  )
}

export const ErrorBoundary = DefaultErrorBoundary
