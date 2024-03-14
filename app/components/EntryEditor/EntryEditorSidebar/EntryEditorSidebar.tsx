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
      <p className="my-4 text-sm leading-tight">
        Action: {navigation.formAction || "None"} / State: {navigation.state}
        <br />
        <span className="text-xs">(Temporary for debugging)</span>
      </p>
      <AddNewMeaningForm entry={entry} />
      <EditingTools entry={entry} />
      <hr />
      <EditingStatus entry={entry} />
      <hr />
      <EntryComment entry={entry} />
    </div>
  )
}
