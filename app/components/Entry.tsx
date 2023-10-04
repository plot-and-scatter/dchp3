import React from "react"

import Headword from "~/components/headwordComponents/Headword"
import Meanings from "~/components/Meanings"
import type { LoadedDataType } from "~/routes/entries/$headword"
import QuickLinks from "./quicklinks/QuickLinks"
import EntryImages from "./EntryImages"
import EntryReferences from "./EntryReferences"

interface EntryProps {
  data: LoadedDataType
}

const Entry = ({ data }: EntryProps): JSX.Element => {
  const bgColor = data.is_legacy
    ? "bg-amber-100"
    : data.no_cdn_conf
    ? "bg-red-100"
    : ""

  return (
    <div className="mx-auto flex max-w-full flex-row justify-around">
      <div className="mx-auto mt-2 mr-5 hidden w-96 max-w-2xl shrink-0 overflow-x-hidden overflow-y-visible md:block">
        <div className="fixed h-3/4 w-96 overflow-y-auto overflow-x-hidden">
          <QuickLinks data={data} />
        </div>
      </div>
      <div className={`md:max-w-2xl lg:max-w-6xl ${bgColor} pl-4 pr-5 pt-1`}>
        <Headword
          word={data.headword}
          id={data.id}
          alternatives={data.spelling_variants || ""}
          generalLabels={data.general_labels || ""}
          handNote={data.fist_note || ""}
          hasDagger={data.dagger}
          etymology={data.etymology || ""}
          isLegacy={data.is_legacy}
          isNonCanadian={data.no_cdn_conf}
        />
        <Meanings meanings={data.meanings} />
        {data.referenceLinks.length > 0 && <EntryReferences data={data} />}
        {data.images.length > 0 && <EntryImages data={data} />}
      </div>
    </div>
  )
}

export default Entry
