import EntryImages from "./EntryImages"
import EntryReferences from "./EntryReferences"
import Headword from "~/components/headwordComponents/Headword"
import Meanings from "~/components/Meanings"
import QuickLinks from "./quicklinks/QuickLinks"
import type { LoadedEntryDataType } from "~/routes/entries/$headword"

type EntryProps = {
  entry: LoadedEntryDataType
  canUserEditEntry: boolean
}

const Entry = ({ entry, canUserEditEntry }: EntryProps): JSX.Element => {
  const bgColor = entry.is_legacy
    ? "bg-amber-100"
    : entry.no_cdn_conf
    ? "bg-primary-lightest"
    : ""

  return (
    <div className="mx-auto flex max-w-full flex-row justify-around">
      <div className="mx-auto mt-2 mr-5 hidden w-96 max-w-2xl shrink-0 overflow-x-hidden overflow-y-visible md:block">
        <div className="fixed h-3/4 w-96 overflow-y-auto overflow-x-hidden">
          <QuickLinks data={entry} />
        </div>
      </div>
      <div className={`md:max-w-2xl lg:max-w-6xl ${bgColor} pl-4 pr-5 pt-1`}>
        <Headword
          word={entry.headword}
          id={entry.id}
          alternatives={entry.spelling_variants || ""}
          generalLabels={entry.general_labels || ""}
          handNote={entry.fist_note || ""}
          hasDagger={entry.dagger}
          etymology={entry.etymology || ""}
          dchpVersion={entry.dchp_version}
          isNonCanadian={entry.no_cdn_conf}
          logEntries={entry.logEntries}
          showEditButton={canUserEditEntry}
        />
        <Meanings meanings={entry.meanings} />
        {entry.referenceLinks.length > 0 && <EntryReferences data={entry} />}
        {entry.images.length > 0 && <EntryImages data={entry} />}
      </div>
    </div>
  )
}

export default Entry
