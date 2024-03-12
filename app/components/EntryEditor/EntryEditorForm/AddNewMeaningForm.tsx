import { EntryEditorFormActionEnum } from "./EntryEditorFormActionEnum"
import AddIcon from "~/components/elements/Icons/AddIcon"
import Button from "~/components/elements/LinksAndButtons/Button"
import EntryEditorForm from "./EntryEditorForm"
import type { LoadedEntryDataType } from "~/routes/entries/$headword"

type AddNewMeaningFormProps = {
  entry: LoadedEntryDataType
}

export default function AddNewMeaningForm({ entry }: AddNewMeaningFormProps) {
  return (
    <EntryEditorForm
      entry={entry}
      formAction={EntryEditorFormActionEnum.ADD_MEANING}
    >
      <Button appearance="success" variant="outline" size="large">
        <AddIcon /> Add new meaning
      </Button>
    </EntryEditorForm>
  )
}
