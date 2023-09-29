import SanitizedTextSpan from "../SanitizedTextSpan"
import { DchpLink } from "../elements/LinksAndButtons/Link"

interface SearchResultProps {
  text: string
  data: any[]
}

const SearchResultFistNotes = ({ text, data }: SearchResultProps) => {
  if (data === undefined || data.length === 0) {
    return null
  }

  return (
    <>
      <h3 className="text-xl font-bold">
        Fist Notes containing &ldquo;{text}&rdquo;: {data.length}
      </h3>
      {data.map((e) => {
        return (
          <div className="my-2 flex flex-col" key={e.id}>
            <DchpLink bold to={`/entries/${e.headword}`}>
              {e.headword}
            </DchpLink>
            <SanitizedTextSpan text={e.fist_note} />
          </div>
        )
      })}
    </>
  )
}

export default SearchResultFistNotes
