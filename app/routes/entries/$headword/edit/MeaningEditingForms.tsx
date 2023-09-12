import { type LoadedDataType } from ".."
import MeaningEditingForm from "./MeaningEditingForm"

interface MeaningEditingFormProps {
  data: LoadedDataType
}

export default function MeaningEditingForms({ data }: MeaningEditingFormProps) {
  return (
    <div id="definitions">
      {data.meanings
        .sort((a, b) => (a.order || "").localeCompare(b.order || ""))
        .map((meaning) => (
          <MeaningEditingForm key={meaning.id} entry={data} meaning={meaning} />
        ))}
    </div>
  )
}
