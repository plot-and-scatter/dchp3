import SanitizedTextSpan from "../SanitizedTextSpan"
import { DchpLink } from "../elements/LinksAndButtons/Link"

interface SearchResultProps {
  text: string
  data: any[]
}

const SearchResultQuotations = ({ text, data }: SearchResultProps) => {
  if (data === undefined || data.length === 0) {
    return null
  }

  return (
    <>
      <h3 className="text-xl font-bold">
        Quotations containing &ldquo;{text}&rdquo;: {data.length}
      </h3>
      {data.map((e) => {
        return (
          <div className="my-2 flex flex-col" key={e.id}>
            <DchpLink bold to={`/bank/edit/${e.id}`}>
              {e.headword.headword}
            </DchpLink>
            <SanitizedTextSpan text={e.text} />
          </div>
        )
      })}
    </>
  )
}

export default SearchResultQuotations
