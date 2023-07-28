import { Link } from "@remix-run/react"
import React from "react"
import type JSXNode from "~/types/JSXNode"

interface Props {
  text: string
  data: any[]
}

const SearchResultEntries = ({ text, data }: Props): JSXNode => {
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

export default SearchResultEntries
