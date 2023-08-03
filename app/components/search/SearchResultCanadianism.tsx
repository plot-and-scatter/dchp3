import { Link } from "@remix-run/react"
import React from "react"
import type JSXNode from "~/types/JSXNode"
import SanitizedTextSpan from "../SanitizedTextSpan"

interface Props {
  text: string
  data: any[]
}

const SearchResultCanadianism = ({ text, data }: Props): JSXNode => {
  if (data === undefined || data.length === 0) {
    return null
  }

  return (
    <>
      <h3 className="text-xl font-bold">
        <>
          Canadianism Type Description containing &ldquo;{text}&rdquo;:{" "}
          {data.length}
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
            <SanitizedTextSpan text={e.canadianism_type_comment} />
          </div>
        )
      })}
    </>
  )
}

export default SearchResultCanadianism
