import RadioOrCheckbox from "../bank/RadioOrCheckbox"
import { EDITING_STATUS_INPUTS } from "../EntryEditor/EntryEditorSidebar/EditingStatus/EditingStatusPanel"

type EditingStatusCheckboxesProps = {
  fields: { editingStatus: any }
}

export default function EditingStatusCheckboxes({
  fields,
}: EditingStatusCheckboxesProps) {
  return (
    <div className="flex flex-col">
      <div className="mr-4">
        <strong>Editing status</strong>
      </div>
      <RadioOrCheckbox
        type="checkbox"
        name="editingStatus"
        optionSetClassName="flex gap-x-2 mr-4"
        direction="vertical"
        conformField={fields.editingStatus}
        options={EDITING_STATUS_INPUTS.map((editingStatus) => ({
          label: editingStatus.label,
          value: editingStatus.type,
          defaultChecked: true,
        }))}
      />
    </div>
  )
}
