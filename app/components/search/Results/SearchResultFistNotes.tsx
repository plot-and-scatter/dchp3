import { Fragment } from "react"
import SanitizedTextSpan from "../../Entry/Common/SanitizedTextSpan"
import { Link } from "../../elements/LinksAndButtons/Link"

interface SearchResultProps {
  text: string
  data: any[]
}

const SearchResultFistNotes = ({ text, data }: SearchResultProps) => {
  if (data === undefined || data.length === 0) {
    return <Fragment>No results.</Fragment>
  }

  return (
    <Fragment>
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
    </Fragment>
  )
}

export default SearchResultFistNotes
