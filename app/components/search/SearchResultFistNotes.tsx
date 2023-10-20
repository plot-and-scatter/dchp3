import SanitizedTextSpan from "../SanitizedTextSpan"
import { Link } from "../elements/LinksAndButtons/Link"

interface SearchResultProps {
  text: string
  data: any[]
}

const SearchResultFistNotes = ({ text, data }: SearchResultProps) => {
  if (data === undefined || data.length === 0) {
    return <>No results.</>
  }

  return (
    <>
      {data.map((e) => {
        return (
          <div className="mb-2 flex flex-col" key={e.id}>
            <Link bold to={`/entries/${e.headword}`}>
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
