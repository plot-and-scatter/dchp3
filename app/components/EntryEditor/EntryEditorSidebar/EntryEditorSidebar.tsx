import { useNavigation } from "@remix-run/react"
import AddNewMeaningForm from "../EntryEditorForm/AddNewMeaningForm"
import EditingStatus from "./EditingStatus/EditingStatusPanel"
import EditingTools from "./EditingTools"
import EntryComment from "./EntryComment"
import type { LoadedEntryDataType } from "~/routes/entries/$headword"

type EditingSidebarProps = {
  entry: LoadedEntryDataType
}

export default function EntryEditorSidebar({ entry }: EditingSidebarProps) {
  const navigation = useNavigation()

  // TODO: Restore fixed status?
  return (
    <div className="sticky">
      <p>Action: {navigation.formAction}</p>
      <p>State: {navigation.state}</p>
      <AddNewMeaningForm entry={entry} />
      <EditingTools entry={entry} />
      <hr />
      <EditingStatus entry={entry} />
      <hr />
      <EntryComment entry={entry} />
    </div>
  )
}
