import { Fragment } from "react"
import SanitizedTextSpan from "../../Entry/Common/SanitizedTextSpan"
import { Link } from "../../elements/LinksAndButtons/Link"

interface Props {
  text: string
  data: any[]
}

const SearchResultCanadianism = ({ text, data }: Props) => {
  if (data === undefined || data.length === 0) {
    return <Fragment>No results.</Fragment>
  }

  return (
    <Fragment>
      {data.map((e) => {
        return (
          <div className="mb-2 flex flex-col" key={e.id}>
            <Link
              to={`/entries/${e.headword}`}
              appearance="primary"
              className="font-bold"
            >
              {e.headword}
            </Link>
            <SanitizedTextSpan text={e.canadianism_type_comment} />
          </div>
        )
      })}
    </Fragment>
  )
}

export default SearchResultCanadianism
