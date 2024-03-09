import { EntryEditorFormActionEnum } from "./EntryEditorFormActionEnum"
import AddIcon from "~/components/elements/Icons/AddIcon"
import Button from "~/components/elements/LinksAndButtons/Button"
import EntryEditorForm from "./EntryEditorForm"
import type { LoadedEntryDataType } from "~/routes/entries/$headword"

type AddNewMeaningFormProps = {
  entry: LoadedEntryDataType
}

export default function AddNewMeaningForm({ entry }: AddNewMeaningFormProps) {
  const { id, headword } = entry

  return (
    <EntryEditorForm
      headword={headword}
      formAction={EntryEditorFormActionEnum.ADD_MEANING}
    >
      <Button appearance="success" variant="outline">
        <AddIcon /> Add new meaning
      </Button>
      <input
        type="hidden"
        name="attributeType"
        value={EntryEditorFormActionEnum.ADD_MEANING}
      />
      <input type="hidden" name="attributeID" value={id} />
      <input type="hidden" name="headword" value={headword} />
    </EntryEditorForm>
  )
}
