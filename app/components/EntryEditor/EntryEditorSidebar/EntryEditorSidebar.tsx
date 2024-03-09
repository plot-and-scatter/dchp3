import { EntryEditorFormActionEnum } from "../EntryEditorForm/EntryEditorFormActionEnum"
import AddNewMeaningForm from "../EntryEditorForm/AddNewMeaningForm"
import EditingStatus from "./EditingStatus/EditingStatusPanel"
import EditingTools from "./EditingTools"
import EntryComment from "./EntryComment"
import EntryEditorForm from "../EntryEditorForm/EntryEditorForm"
import type { LoadedEntryDataType } from "~/routes/entries/$headword"

type EditingSidebarProps = {
  entry: LoadedEntryDataType
}

export default function EntryEditorSidebar({ entry }: EditingSidebarProps) {
  const { id, headword } = entry

  return (
    <div className="fixed">
      <AddNewMeaningForm entry={entry} />
      <EntryEditorForm
        headword={headword}
        formAction={EntryEditorFormActionEnum.ADD_MEANING}
      >
        <input type="hidden" name="attributeID" value={id} />
      </EntryEditorForm>

      <EditingTools entry={entry} />
      <hr />
      <EditingStatus entry={entry} />
      <hr />
      <EntryComment entry={entry} />
    </div>
  )
}
