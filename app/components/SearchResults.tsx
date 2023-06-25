import { Link } from "@remix-run/react"
import React from "react"
import type JSXNode from "~/types/JSXNode"

interface SearchResultsProps {
  data: any
  text: string
  pageNumber: string | undefined
}

function displayEntries(pageNumber: string, text: string, data: any) {
  return (
    <>
      <h3 className="text-xl font-bold">
        <>
          Entries containing &ldquo;{text}&rdquo;: {data.entries.length}
        </>
      </h3>
      {data.entries.map((e: any) => {
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
    </>
  )
}

function displayMeanings(pageNumber: string, text: string, data: any) {
  return (
    <>
      <h3 className="text-xl font-bold">
        <>
          Meanings containing &ldquo;{text}&rdquo;: &nbsp;
          {data.meanings.length}
        </>
      </h3>
      {data.meanings.map((e: any) => {
        return (
          <div key={"MeaningDiv" + e.id}>
            <p key={"meaningHeadword: " + e.id}>
              <Link
                to={`/entries/${e.entry.headword}`}
                className="font-bold text-red-600 hover:text-red-400"
              >
                {e.entry.headword}
              </Link>
            </p>

            <p key={"meaning: " + e.id}>{e.definition}</p>
          </div>
        )
      })}
    </>
  )
}

const SearchResults = ({
  data,
  text,
  pageNumber,
}: SearchResultsProps): JSXNode => {
  const page = pageNumber ? pageNumber : "1"

  // return near the top the LINKS that go to the pages
  return (
    <div className="mt-3 flex w-4/6 flex-col justify-center align-middle">
      {displayEntries(page, text, data.everything)}
      {displayMeanings(page, text, data.everything)}
    </div>
  )
}

export default SearchResults
