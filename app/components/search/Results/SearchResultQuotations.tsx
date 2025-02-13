import type { Quotation } from "~/models/search/getSearchResultQuotations"
import SanitizedTextSpan from "../../Entry/Common/SanitizedTextSpan"
import { Link } from "../../elements/LinksAndButtons/Link"

interface SearchResultProps {
  text: string
  data: Quotation[]
}

const SearchResultQuotations = ({ text, data }: SearchResultProps) => {
  if (data === undefined || data.length === 0) {
    return <>No results.</>
  }

  return (
    <>
      {data.map((citation) => {
        const headword = citation.meanings.find(
          (m) => m.meaning?.entry?.headword !== null
        )?.meaning?.entry.headword
        return (
          <div className="mb-2 flex flex-col" key={citation.id}>
            <Link bold to={`/entries/${headword}`}>
              {headword ?? "\u2014 no headword available \u2014 "}
            </Link>
            <SanitizedTextSpan text={citation.citation} />
          </div>
        )
      })}
    </>
  )
}

export default SearchResultQuotations
