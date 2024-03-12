import AddNewMeaningForm from "~/components/EntryEditor/EntryEditorForm/AddNewMeaningForm"
import { type LoadedEntryDataType } from ".."
import MeaningEditingForm from "./MeaningEditingForm"

interface MeaningEditingFormProps {
  data: LoadedEntryDataType
}

export default function MeaningEditingForms({ data }: MeaningEditingFormProps) {
  return (
    <div id="definitions">
      {data.meanings
        .sort((a, b) => (a.order || "").localeCompare(b.order || ""))
        .map((meaning) => (
          <MeaningEditingForm key={meaning.id} entry={data} meaning={meaning} />
        ))}
      <div className="text-center">
        <AddNewMeaningForm entry={data} />
      </div>
    </div>
  )
}
