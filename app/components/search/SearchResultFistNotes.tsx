import { Link } from "@remix-run/react"
import React from "react"
import type JSXNode from "~/types/JSXNode"
import SanitizedTextSpan from "../SanitizedTextSpan"

interface SearchResultProps {
  text: string
  data: any[]
}

const SearchResultFistNotes = ({ text, data }: SearchResultProps): JSXNode => {
  if (data === undefined || data.length === 0) {
    return null
  }

  return (
    <>
      <h3 className="text-xl font-bold">
        <>
          Fist Notes containing &ldquo;{text}&rdquo;: {data.length}
        </>
      </h3>
      {data.map((e) => {
        return (
          <div className="my-2 flex flex-col" key={e.id}>
            <Link
              to={`/entries/${e.headword}`}
              className="font-bold text-red-600 hover:text-red-400"
            >
              {e.headword}
            </Link>
            <SanitizedTextSpan text={e.fist_note} />
          </div>
        )
      })}
    </>
  )
}

export default SearchResultFistNotes