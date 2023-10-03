import {
  Form,
  useLoaderData,
  useParams,
  useSearchParams,
} from "@remix-run/react"
import { DefaultErrorBoundary } from "~/components/elements/DefaultErrorBoundary"
import { getSearchResults } from "~/models/search.server"
import { redirect } from "@remix-run/node"
import { SearchResultEnum } from "./searchResultEnum"
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
  const attribute: string =
    url.searchParams.get("attribute") ?? SearchResultEnum.HEADWORD

  const searchResults: any[] = await getSearchResults(
    text,
    pageNumber,
    caseSensitive,
    attribute
  )

  if (!searchResults || searchResults.length === 0) {
    throw new Response(null, {
      status: 404,
      statusText: `No Results Found for ${attribute} "${text}"`,
    })
  }
  return searchResults
}

export default function EntryDetailsPage() {
  const data: any[] = useLoaderData<typeof loader>()
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
