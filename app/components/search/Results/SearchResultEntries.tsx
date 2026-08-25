import DictionaryVersionLabel from "~/components/elements/Labels/DictionaryVersionLabel"
import DraftLabel from "../../elements/Labels/DraftLabel"
import { Link } from "../../elements/LinksAndButtons/Link"

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
            <DictionaryVersionLabel dchpVersion={e.dchp_version} />
            <Link
              to={`/entries/${e.headword}`}
              appearance="primary"
              className="font-bold"
            >
              {e.headword}
            </Link>
            <DraftLabel isPublic={e.is_public} />
          </p>
        )
      })}
    </>
  )
}

export default SearchResultEntries
