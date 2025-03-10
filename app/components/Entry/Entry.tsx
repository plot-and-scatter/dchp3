import EntryImages from "./Images/EntryImages"
import EntryReferences from "./References/EntryReferences"
import Headword from "~/components/Entry/Headword/Headword"
import Meanings from "~/components/Entry/Meanings/Meanings"
import QuickLinks from "../quicklinks/QuickLinks"
import type { LoadedEntryDataType } from "~/routes/entries/$headword"
import { Link } from "../elements/LinksAndButtons/Link"
import EditIcon from "../elements/Icons/EditIcon"

type EntryProps = {
  entry: LoadedEntryDataType
  canUserEditEntry: boolean
  canUserViewDraftEntry: boolean
}

const Entry = ({
  entry,
  canUserEditEntry,
  canUserViewDraftEntry,
}: EntryProps): JSX.Element => {
  //  TODO: Don't rely on `is_legacy`; use `dchp_version` instead.
  const bgColor = entry.is_legacy
    ? "bg-amber-50"
    : entry.no_cdn_conf
    ? "bg-red-200"
    : ""

  return (
    <div
      className="mx-auto flex min-w-full max-w-full flex-row justify-around gap-4"
      data-id={`entry-${entry?.id}`}
    >
      <div className="w-96 max-w-2xl">
        {canUserEditEntry && (
          <Link
            asButton
            className="mb-4 whitespace-nowrap"
            to={`/entries/${entry.headword}/edit`}
            appearance="success"
            buttonSize="large"
          >
            <EditIcon />
            Edit entry
          </Link>
        )}
        <div className="hidden md:block">
          <QuickLinks data={entry} />
        </div>
      </div>
      <div
        className={`md:max-w-2xl lg:max-w-6xl ${bgColor} flex-1 pl-4 pr-5 pt-1`}
      >
        <Headword entry={entry} showEditButton={canUserEditEntry} />
        <Meanings
          meanings={entry.meanings}
          canUserViewDraftEntry={canUserViewDraftEntry}
        />
        {entry.referenceLinks.length > 0 && <EntryReferences data={entry} />}
        {entry.images.length > 0 && <EntryImages data={entry} />}
      </div>
    </div>
  )
}

export default Entry
