import SanitizedTextSpan from "../EntryEditor/SanitizedTextSpan"
import { Link } from "../elements/LinksAndButtons/Link"

interface SearchResultProps {
  text: string
  data: any[]
}

const SearchResultQuotations = ({ text, data }: SearchResultProps) => {
  if (data === undefined || data.length === 0) {
    return <>No results.</>
  }

  return (
    <>
      {data.map((e) => {
        return (
          <div className="mb-2 flex flex-col" key={e.id}>
            <Link bold to={`/bank/edit/${e.id}`}>
              {e.headword?.headword ?? "\u2014 no headword available \u2014 "}
            </Link>
            <SanitizedTextSpan text={e.text} />
          </div>
        )
      })}
    </>
  )
}

export default SearchResultQuotations
