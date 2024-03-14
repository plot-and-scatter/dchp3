import { type LoadedEntryDataType } from "../../../routes/entries/$headword"
import AddNewMeaningForm from "~/components/EntryEditor/EntryEditorForm/AddNewMeaningForm"
import EditMeaning from "./EditMeaning"

interface EditMeaningsProps {
  data: LoadedEntryDataType
}

export default function EditMeanings({ data }: EditMeaningsProps) {
  return (
    <div id="definitions">
      {data.meanings
        .sort((a, b) => (a.order || "").localeCompare(b.order || ""))
        .map((meaning) => (
          <EditMeaning key={meaning.id} entry={data} meaning={meaning} />
        ))}
      <div className="text-center">
        <AddNewMeaningForm entry={data} />
      </div>
    </div>
  )
}
