import { Link } from "@remix-run/react"
import React from "react"
import type JSXNode from "~/types/JSXNode"
import SanitizedTextSpan from "../SanitizedTextSpan"

interface Props {
  text: string
  data: any[]
}

const SearchResultMeanings = ({ text, data }: Props): JSXNode => {
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

export default SearchResultMeanings
