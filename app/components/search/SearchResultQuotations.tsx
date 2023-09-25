import { Link } from "@remix-run/react"
import React from "react"
import type JSXNode from "~/types/JSXNode"
import SanitizedTextSpan from "../SanitizedTextSpan"

interface SearchResultProps {
  text: string
  data: any[]
}

const SearchResultQuotations = ({ text, data }: SearchResultProps): JSXNode => {
  if (data === undefined || data.length === 0) {
    return null
  }

  return (
    <>
      <h3 className="text-xl font-bold">
        <>
          Quotations containing &ldquo;{text}&rdquo;: {data.length}
        </>
      </h3>
      {data.map((e) => {
        return (
          <div className="my-2 flex flex-col" key={e.id}>
            <Link
              to={`/bank/edit/${e.id}`}
              className="font-bold text-red-600 hover:text-red-400"
            >
              {e.headword.headword}
            </Link>
            <SanitizedTextSpan text={e.text} />
          </div>
        )
      })}
    </>
  )
}

export default SearchResultQuotations
