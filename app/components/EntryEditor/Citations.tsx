import Citation from "./Citation"
import type { MeaningType } from "../Entry/Meanings/Meaning"

interface CitationsProps {
  meaning: MeaningType
}

const Citations = ({ meaning }: CitationsProps): JSX.Element => {
  return (
    <div className="-mx-2 -mb-2 mt-2 flex flex-col gap-2 border border-l-0 border-amber-200 bg-amber-50 px-2 py-0 text-base md:-mx-6 md:-mb-4 md:gap-3 md:p-6 md:text-lg">
      <h2 className="text-lg font-bold text-amber-600 md:text-2xl">
        Quotations
      </h2>
      {meaning.citations
        .map((c) => c.citation)
        .sort((a, b) => {
          if (!a || !b) return 0
          const aYearComp = a.yearcomp ? a.yearcomp.split("-")[0] : ""
          const bYearComp = b.yearcomp ? b.yearcomp.split("-")[0] : ""
          const aYearPub = a.yearpub ? a.yearpub.split("-")[0] : ""
          const bYearPub = b.yearpub ? b.yearpub.split("-")[0] : ""
          return (
            parseInt(aYearComp || aYearPub) - parseInt(bYearComp || bYearPub)
          )
        })
        .map((c) => {
          if (!c) return null
          return <Citation citation={c} key={c.id} />
        })}
    </div>
  )
}

export default Citations
