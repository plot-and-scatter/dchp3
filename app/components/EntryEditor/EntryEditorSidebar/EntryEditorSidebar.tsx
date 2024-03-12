import AddNewMeaningForm from "../EntryEditorForm/AddNewMeaningForm"
import EditingStatus from "./EditingStatus/EditingStatusPanel"
import EditingTools from "./EditingTools"
import EntryComment from "./EntryComment"
import type { LoadedEntryDataType } from "~/routes/entries/$headword"

type EditingSidebarProps = {
  entry: LoadedEntryDataType
}

export default function EntryEditorSidebar({ entry }: EditingSidebarProps) {
  // TODO: Restore fixed status?
  return (
    <div>
      <AddNewMeaningForm entry={entry} />
      <EditingTools entry={entry} />
      <hr />
      <EditingStatus entry={entry} />
      <hr />
      <EntryComment entry={entry} />
    </div>
  )
}
