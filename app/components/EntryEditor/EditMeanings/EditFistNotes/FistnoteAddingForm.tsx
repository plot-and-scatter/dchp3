import HandNoteBlock from "~/components/Entry/Common/HandNoteBlock"
import type { MeaningType } from "~/components/Entry/Meanings/Meaning"
import TextArea from "~/components/bank/TextArea"
import AddIcon from "~/components/elements/Icons/AddIcon"
import SaveIcon from "~/components/elements/Icons/SaveIcon"
import Button from "~/components/elements/LinksAndButtons/Button"
import { EntryEditorFormActionEnum } from "../../EntryEditorForm/EntryEditorFormActionEnum"
import MeaningEditorForm from "../../EntryEditorForm/MeaningEditorForm"
import { QuaternaryHeader } from "~/components/elements/Headings/QuaternaryHeader"

interface FistnoteAddingFormProps {
  meaning: MeaningType
  headword: string
}

export default function FistnoteAddingForm({
  headword,
  meaning,
}: FistnoteAddingFormProps) {
  return (
    <MeaningEditorForm
      headword={headword}
      meaning={meaning}
      formAction={EntryEditorFormActionEnum.ADD_DEFINITION_FIST_NOTE}
      className={
        "mt-4 rounded border border-action-400 bg-action-100 p-4 shadow"
      }
      resetOnSuccess
    >
      <QuaternaryHeader>
        <AddIcon /> Add fist note
      </QuaternaryHeader>
      <div className="flex items-center gap-x-4 text-sm">
        <HandNoteBlock className="w-full text-lg">
          <TextArea
            name="text"
            lightBorder
            className="text-lg"
            placeholder="Enter fist note"
          />
        </HandNoteBlock>
        <Button appearance="success" className="whitespace-nowrap">
          <SaveIcon /> Save fist note
        </Button>
      </div>
    </MeaningEditorForm>
  )
}
