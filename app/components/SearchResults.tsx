import { Link } from "@remix-run/react"
import React from "react"
import type JSXNode from "~/types/JSXNode"
import SanitizedTextSpan from "./SanitizedTextSpan"
import { SearchResultEnum } from "~/routes/search/searchResultEnum"

interface SearchResultsProps {
  data: any[]
  text: string
  pageNumber: string | undefined
  searchAttribute: string | null
}

function getSearchResults(
  pageNumber: string,
  text: string,
  data: any[],
  attribute: string
) {
  switch (attribute) {
    case SearchResultEnum.HEADWORD:
      return displayEntries(pageNumber, text, data)
    case SearchResultEnum.MEANING:
      return displayMeanings(pageNumber, text, data)
    default:
  }
}

function displayEntries(pageNumber: string, text: string, data: any[]) {
  if (data === undefined || data.length === 0) {
    return null
  }

  return (
    <>
      <h3 className="text-xl font-bold">
        <>
          Entries containing &ldquo;{text}&rdquo;: {data.length}
        </>
      </h3>
      {data.map((e) => {
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

function displayMeanings(pageNumber: string, text: string, data: any[]) {
  if (data === undefined || data.length === 0) {
    return null
  }

  return (
    <>
      <h3 className="text-xl font-bold">
        <>
          Meanings containing &ldquo;{text}&rdquo;: &nbsp;
          {data.length}
        </>
      </h3>
      {data.map((e) => {
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
  searchAttribute,
}: SearchResultsProps): JSXNode => {
  const page = pageNumber ? pageNumber : "1"
  const attribute: string = searchAttribute ? searchAttribute : "NULL ATTRIBUTE"

  console.log(attribute)

  return (
    <div className="mt-3 flex max-w-3xl flex-col justify-center align-middle">
      {getSearchResults(page, text, data, attribute)}
    </div>
  )
}

export default SearchResults
