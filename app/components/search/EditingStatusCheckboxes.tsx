import { EDITING_STATUS_INPUTS } from "../EntryEditor/EntryEditorSidebar/EditingStatus/EditingStatusPanel"
import RadioOrCheckbox from "../bank/RadioOrCheckbox"
import type { FieldMetadata } from "@conform-to/react"

type EditingStatusCheckboxesProps = {
  fields: { editingStatus: FieldMetadata<string[]> }
  // When the caller supplies its own heading (the collapsible on the search
  // page), skip the built-in one.
  hideHeading?: boolean
}

export default function EditingStatusCheckboxes({
  fields,
  hideHeading,
}: EditingStatusCheckboxesProps) {
  return (
    <div className="flex flex-col">
      {!hideHeading && (
        <div className="mr-4">
          <strong>Editing status</strong>
        </div>
      )}
      {/* Two columns on phones, read down then across; one from sm up. */}
      <div className="columns-2 gap-x-4 sm:columns-1">
        <RadioOrCheckbox
          type="checkbox"
          name="editingStatus"
          optionSetClassName="flex items-baseline gap-x-2"
          direction="vertical"
          conformField={fields.editingStatus}
          options={EDITING_STATUS_INPUTS.map((editingStatus) => ({
            label: editingStatus.label,
            value: editingStatus.type,
            defaultChecked: true,
          }))}
        />
      </div>
    </div>
  )
}
