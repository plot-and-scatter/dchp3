import { EntryEditorFormActionEnum } from "../EntryEditorForm/EntryEditorFormActionEnum"
import AddIcon from "~/components/elements/Icons/AddIcon"
import Button from "~/components/elements/LinksAndButtons/Button"
import EntryEditorForm from "../EntryEditorForm/EntryEditorForm"
import Input from "~/components/bank/Input"
import ReferenceCombobox from "./ReferenceCombobox"
import SaveIcon from "~/components/elements/Icons/SaveIcon"
import TopLabelledField from "~/components/bank/TopLabelledField"
import type { LoadedEntryDataType } from "~/routes/entries/$headword"

interface AddReferenceProps {
  entry: LoadedEntryDataType
}

export default function AddReference({ entry }: AddReferenceProps) {
  return (
    <EntryEditorForm
      entry={entry}
      formAction={EntryEditorFormActionEnum.ADD_REFERENCE_LINK}
      className={
        "mt-4 rounded border border-success-400 bg-success-100 p-4 shadow"
      }
      // {...getFormProps(form)}
    >
      <h4 className="mb-4 text-base font-bold">
        <AddIcon /> Add reference
      </h4>
      <div className="flex items-end gap-x-4 text-sm">
        <div className="flex-1">
          <ReferenceCombobox name="referenceId" />
        </div>
        <div className="w-1/4 shrink-0">
          <TopLabelledField
            labelWidth="w-full"
            label="Link text (optional)"
            field={
              <Input
                name="linkText"
                lightBorder
                placeholder="e.g. Transporation: The Canoe"
              />
            }
          />
        </div>
        <div className="w-1/4 shrink-0">
          <TopLabelledField
            label="Link target"
            field={
              <Input
                name="linkTarget"
                lightBorder
                placeholder="e.g. https://hbcheritage.ca/the-canoe"
              />
            }
          />
        </div>
        <Button appearance="success" className="whitespace-nowrap">
          <SaveIcon /> Save reference
        </Button>
      </div>
    </EntryEditorForm>
  )
}
