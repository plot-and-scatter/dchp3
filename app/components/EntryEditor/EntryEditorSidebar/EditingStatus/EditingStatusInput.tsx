import type { EditingStatusTypeEnum } from "./EditingStatusTypeEnum"
import RadioOrCheckbox from "~/components/bank/RadioOrCheckbox"

export type EditingStatusInputProps = {
  type: EditingStatusTypeEnum
  label: string
  defaultChecked: boolean
}

export default function EditingStatusInput({
  type,
  label,
  defaultChecked,
}: EditingStatusInputProps) {
  return (
    <div className="w-1/2 text-sm">
      <RadioOrCheckbox
        type="checkbox"
        name={type}
        optionSetClassName="flex gap-x-2"
        inputClassName="border border-gray-300"
        options={[{ label, value: "true", defaultChecked }]}
      />
    </div>
  )
}
