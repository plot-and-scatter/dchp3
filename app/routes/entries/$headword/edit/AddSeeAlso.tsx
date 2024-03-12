import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import Button from "~/components/elements/LinksAndButtons/Button"
import SeeAlsoInput from "./SeeAlsoInput"
import MeaningEditorForm from "~/components/EntryEditor/EntryEditorForm/MeaningEditorForm"
import type { MeaningType } from "~/components/EntryEditor/Meaning"
import SaveIcon from "~/components/elements/Icons/SaveIcon"
import TopLabelledField from "~/components/bank/TopLabelledField"
import Input from "~/components/bank/Input"
import AddIcon from "~/components/elements/Icons/AddIcon"

interface AddSeeAlsoProps {
  meaning: MeaningType
  headword: string
}

export default function AddSeeAlso({ meaning, headword }: AddSeeAlsoProps) {
  return (
    <MeaningEditorForm
      headword={headword}
      meaning={meaning}
      formAction={EntryEditorFormActionEnum.ADD_SEE_ALSO}
      className={"mt-4 rounded border border-gray-400 bg-red-100 p-4 shadow"}
    >
      <h4 className="mb-4 text-base font-bold">
        <AddIcon /> Add see also
      </h4>
      <div className="flex items-end gap-x-4 text-sm">
        <SeeAlsoInput name="headwordToAdd" />
        <TopLabelledField label="Comment" field={<Input name="linkNote" />} />
        <Button appearance="success">
          <SaveIcon /> Save see also
        </Button>
      </div>
    </MeaningEditorForm>
  )
}
