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
    <div className="mt-2 mr-5 hidden w-96 shrink-0 overflow-hidden  md:block">
      <div className="fixed w-96 overflow-hidden ">
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
      </div>
    </div>
  )
}

export default QuickLinks
