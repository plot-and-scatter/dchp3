import React from "react"
import type { LoadedDataType } from "~/routes/entries/$headword"
import SanitizedTextSpan from "../SanitizedTextSpan"
import QuickLink from "./QuickLink"

interface QuickLinksProps {
  data: LoadedDataType
}

const QuickLinks = ({ data }: QuickLinksProps): JSX.Element => {
  function filterOrderString(meaningOrder: string | null): string | null {
    const validMeaningOrder: boolean =
      meaningOrder !== null && meaningOrder !== "0"
    return validMeaningOrder ? meaningOrder : ""
  }

  return (
    <>
      <h3 className="mb-2 text-lg font-bold text-slate-600">Quick links</h3>
      {data ? (
        <ul className="">
          <QuickLink scrollToId="headword">
            <span className="text-xl font-bold">{data.headword}</span>
          </QuickLink>
          <QuickLink scrollToId="definitions">Definitions</QuickLink>
          <>
            {data.meanings
              .sort((a, b) => (a.order || "").localeCompare(b.order || ""))
              .map((meaning) => (
                <QuickLink
                  key={meaning.id}
                  scrollToId={`meaning-${meaning.id}`}
                >
                  <span className="ml-2 font-bold">
                    {filterOrderString(meaning.order)}
                  </span>{" "}
                  <SanitizedTextSpan text={meaning.definition} />
                </QuickLink>
              ))}
          </>
          {/* <QuickLink>References</QuickLink> */}
        </ul>
      ) : (
        <div>Loading...</div>
      )}
    </>
  )
}

export default QuickLinks
