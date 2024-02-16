import { Link } from "../elements/LinksAndButtons/Link"

interface Props {
  text: string
  data: any[]
}

const SearchResultEntries = ({ text, data }: Props) => {
  if (data === undefined || data.length === 0) {
    return <>No results.</>
  }

  return (
    <>
      {data.map((e) => {
        return (
          <p key={e.id}>
            <Link
              to={`/entries/${e.headword}`}
              appearance="primary"
              className="font-bold"
            >
              {e.headword}
            </Link>
          </p>
        )
      })}
    </>
  )
}

export default SearchResultEntries
