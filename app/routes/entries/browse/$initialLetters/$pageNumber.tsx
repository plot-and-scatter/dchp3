import { LoaderArgs, } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Link, useCatch, useLoaderData, useParams, } from "@remix-run/react"
import invariant from "tiny-invariant"

import { getEntriesByInitialLettersAndPage } from "~/models/entry.server"

// https://github.com/remix-run/remix/discussions/3407
export async function loader({ request, params }: LoaderArgs) {
  invariant(params.initialLetters, "initialLetters not found")
  invariant(params.pageNumber, "pageNumber not found")

  // const pageNumber: number = params.pageNumber
  const entries = await getEntriesByInitialLettersAndPage(
    params.initialLetters,
    params.pageNumber);

  if (!entries) {
    throw new Response("Not Found", { status: 404 })
  }
  return json({ entries })
}

export default function EntryDetailsPage() {
  const data = useLoaderData<typeof loader>()
  const params = useParams()

  let curPage: number;

  if (params.pageNumber) {
    curPage = parseInt(params.pageNumber);
  } else {
    curPage = 1;
  }

  return (
    <div>
      <h3 className="text-2xl font-bold">
        <>
          Entries starting with {params.initialLetters}: Page {params.pageNumber}
        </>
      </h3>
      {data.entries.map((e) => {
        return (
          <p key={e.id}>
            <Link
              to={`/entries/${e.headword}`}
              className="font-bold text-red-600 hover:text-red-400"
            >
              {e.headword}
            </Link>
          </p>
        )
      })}
      <Link to={`../browse/${params.initialLetters}/${curPage - 1}`}>
        <button name="previousPage" className="bg-slate-500 border-gray-900 p-3 m-3">Prev Page</button>
      </Link>
      <Link to={`../browse/${params.initialLetters}/${curPage + 1}`}>
        <button name="nextPage" className="bg-slate-500 border-gray-900 p-3 m-3">Next Page</button>
      </Link>
    </div>
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
