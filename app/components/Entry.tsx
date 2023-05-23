import React from "react"

import Headword from "~/components/Headword"
import Meanings from "~/components/Meanings"
import type { LoadedDataType } from "~/routes/entries/$headword"
import QuickLinks from "./quicklinks/QuickLinks"

interface EntryProps {
  data: LoadedDataType
}

const Entry = ({ data }: EntryProps): JSX.Element => {
  console.log("data", data)

  const bgColor = data.is_legacy
    ? "bg-amber-100"
    : data.no_cdn_conf
    ? "bg-red-100"
    : ""

  return (
    <>
      <QuickLinks data={data} />
      <div className={`md:max-w-xl lg:max-w-3xl ${bgColor} pl-4 pr-5 pt-1`}>
        <div>
          <Headword
            word={data.headword}
            alternatives={data.spelling_variants || ""}
            generalLabels={data.general_labels || ""}
            handNote={data.fist_note || ""}
            etymology={data.etymology || ""}
            isLegacy={data.is_legacy}
            isNonCanadian={data.no_cdn_conf}
          />
          <Meanings meanings={data.meanings} />
        </div>
      </div>
    </>
  )
}

export default Entry
