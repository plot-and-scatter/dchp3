import { Link } from "../elements/LinksAndButtons/Link"
import SanitizedTextSpan from "../SanitizedTextSpan"

interface SearchResultProps {
  text: string
  data: any[]
}

const SearchResultUsageNotes = ({ text, data }: SearchResultProps) => {
  if (data === undefined || data.length === 0) {
    return null
  }

  return (
    <>
      <h3 className="text-xl font-bold">
        Usage Notes containing &ldquo;{text}&rdquo;: {data.length}
      </h3>
      {data.map((e) => {
        return (
          <div className="my-2 flex flex-col" key={e.id}>
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
