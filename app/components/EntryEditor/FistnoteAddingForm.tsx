import { Form } from "@remix-run/react"
import { Input } from "postcss"
import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import AddIcon from "~/components/elements/Icons/AddIcon"
import Button from "~/components/elements/LinksAndButtons/Button"
import TopLabelledField from "../bank/TopLabelledField"
import SaveIcon from "../elements/Icons/SaveIcon"
import MeaningEditorForm from "./EntryEditorForm/MeaningEditorForm"
import type { MeaningType } from "../Entry/Meanings/Meaning"
import TextArea from "../bank/TextArea"
import HandNoteBlock from "../Entry/Common/HandNoteBlock"

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
      className={"mt-4 rounded border border-gray-400 bg-action-100 p-4 shadow"}
    >
      <h4 className="mb-4 text-base font-bold">
        <AddIcon /> Add fist note
      </h4>
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
