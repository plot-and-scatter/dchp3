import { Fragment } from "react"
import SanitizedTextSpan from "../../Entry/Common/SanitizedTextSpan"
import { Link } from "../../elements/LinksAndButtons/Link"

interface Props {
  text: string
  data: any[]
}

const SearchResultMeanings = ({ text, data }: Props) => {
  if (data === undefined || data.length === 0) {
    return <Fragment>No results.</Fragment>
  }

  return (
    <Fragment>
      {data.map((e) => {
        return (
          <div className="m-1" key={"MeaningDiv" + e.id}>
            <p key={"meaningHeadword: " + e.id}>
              <Link to={`/entries/${e.entry.headword}`} bold>
                {e.entry.headword}
              </Link>
            </p>
            <p key={"meaning: " + e.id}>
              <SanitizedTextSpan text={e.definition} />
            </p>
          </div>
        )
      })}
    </Fragment>
  )
}

export default SearchResultMeanings
