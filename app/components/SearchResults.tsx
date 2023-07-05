import { Link } from "@remix-run/react"
import React from "react"
import type JSXNode from "~/types/JSXNode"
import SanitizedTextSpan from "./SanitizedTextSpan"

interface SearchResultsProps {
  data: Record<string, any[]>
  text: string
  pageNumber: string | undefined
}

function displayEntries(
  pageNumber: string,
  text: string,
  data: Record<string, any[]>
) {
  if (data.entries === undefined || data.entries.length === 0) {
    return null
  }

  return (
    <>
      <h3 className="text-xl font-bold">
        <>
          Entries containing &ldquo;{text}&rdquo;: {data.entries.length}
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
    </>
  )
}

function displayMeanings(
  pageNumber: string,
  text: string,
  data: Record<string, any[]>
) {
  if (data.meanings === undefined || data.meanings.length === 0) {
    return null
  }

  return (
    <>
      <h3 className="text-xl font-bold">
        <>
          Meanings containing &ldquo;{text}&rdquo;: &nbsp;
          {data.meanings.length}
        </>
      </h3>
      {data.meanings.map((e) => {
        return (
          <div className="m-1" key={"MeaningDiv" + e.id}>
            <p key={"meaningHeadword: " + e.id}>
              <Link
                to={`/entries/${e.entry.headword}`}
                className="font-bold text-red-600 hover:text-red-400"
              >
                {e.entry.headword}
              </Link>
            </p>
            <p key={"meaning: " + e.id}>
              <SanitizedTextSpan text={e.definition} />
            </p>
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
    <div className="mt-3 w-4/5 align-middle">
      {displayEntries(page, text, data)}
      {displayMeanings(page, text, data)}
    </div>
  )
}

export default SearchResults
