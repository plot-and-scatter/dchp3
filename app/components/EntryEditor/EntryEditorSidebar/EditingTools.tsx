import { EntryEditorFormActionEnum } from "../EntryEditorForm/EntryEditorFormActionEnum"
import { type LoadedEntryDataType } from "~/routes/entries/$headword"
import Button from "../../elements/LinksAndButtons/Button"
import SaveIcon from "~/components/elements/Icons/SaveIcon"
import { QuaternaryHeader } from "~/components/elements/Headings/QuaternaryHeader"
import RadioOrCheckbox from "~/components/bank/RadioOrCheckbox"
import EntryEditorForm from "../EntryEditorForm/EntryEditorForm"

interface EditingToolsProps {
  entry: LoadedEntryDataType
}

const EditingTools = ({ entry }: EditingToolsProps) => {
  return (
    <EntryEditorForm
      entry={entry}
      formAction={EntryEditorFormActionEnum.EDITING_TOOLS}
    >
      <QuaternaryHeader>Visibility</QuaternaryHeader>
      <div className="-mt-4 flex flex-row items-center">
        <div className="w-1/2">
          <RadioOrCheckbox
            type="checkbox"
            name="isPublic"
            optionSetClassName="flex gap-x-2 text-sm"
            inputClassName="border border-gray-300"
            options={[
              {
                label: "Publicly visible",
                value: "true",
                defaultChecked: entry.is_public,
              },
            ]}
          />
        </div>
        <div className="w-1/2">
          <Button variant="outline" size="small" appearance="success">
            <SaveIcon /> Save visibility
          </Button>
        </div>
      </div>
    </EntryEditorForm>
  )
}

export default EditingTools
