import { Link } from "../../elements/LinksAndButtons/Link"
import SanitizedTextSpan from "../../Entry/Common/SanitizedTextSpan"

interface SearchResultProps {
  text: string
  data: any[]
}

const SearchResultUsageNotes = ({ text, data }: SearchResultProps) => {
  if (data === undefined || data.length === 0) {
    return <>No results.</>
  }

  return (
    <>
      {data.map((e) => {
        return (
          <div className="mb-2 flex flex-col" key={e.id}>
            <Link to={`/entries/${e.headword}`} bold>
              {e.headword}
            </Link>
            <SanitizedTextSpan text={e.partofspeech + " \u2014 " + e.usage} />
          </div>
        )
      })}
    </>
  )
}

export default SearchResultUsageNotes
