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
          <p key={e.id} className="flex items-center">
            <Link
              to={`/entries/${e.headword}`}
              appearance="primary"
              className="font-bold"
            >
              {e.headword}
            </Link>
            {e.is_public ? (
              ""
            ) : (
              <span className="ml-1 bg-alert-200 px-1 py-0.5 text-xs uppercase">
                Draft
              </span>
            )}
          </p>
        )
      })}
    </>
  )
}

export default SearchResultEntries
