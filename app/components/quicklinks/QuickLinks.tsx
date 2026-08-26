import { Fragment } from "react"
import type { LoadedEntryDataType } from "~/routes/entries/$headword"
import SanitizedTextSpan from "../Entry/Common/SanitizedTextSpan"
import QuickLink from "./QuickLink"

interface QuickLinksProps {
  data: LoadedEntryDataType
}

const QuickLinks = ({ data }: QuickLinksProps): JSX.Element => {
  function filterOrderString(meaningOrder: string | null): string | null {
    const validMeaningOrder: boolean =
      meaningOrder !== null && meaningOrder !== "0"
    return validMeaningOrder ? meaningOrder : ""
  }

  return (
    <Fragment>
      <h3 className="mb-2 text-lg font-bold text-gray-600">Quick links</h3>
      {data ? (
        <ul className="">
          <QuickLink scrollToId="headword">
            <span className="text-xl font-bold">{data.headword}</span>
          </QuickLink>
          <QuickLink scrollToId="definitions">Definitions</QuickLink>
          <Fragment>
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
          </Fragment>
          {/* <QuickLink>References</QuickLink> */}
        </ul>
      ) : (
        <div>Loading...</div>
      )}
    </Fragment>
  )
}

export default QuickLinks
