import { type LoadedDataType } from ".."
import MeaningEditingForm from "./MeaningEditingForm"

interface MeaningEditingFormProps {
  data: LoadedDataType
}

export default function MeaningEditingForms({ data }: MeaningEditingFormProps) {
  const headword = data.headword

  return (
    <div id="definitions">
      {data.meanings
        .sort((a, b) => (a.order || "").localeCompare(b.order || ""))
        .map((meaning) => (
          <MeaningEditingForm
            key={meaning.id}
            headword={headword}
            meaning={meaning}
          />
        ))}
    </div>
  )
}
