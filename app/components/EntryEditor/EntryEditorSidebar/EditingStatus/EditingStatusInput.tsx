import { useState } from "react"
import type { EditingStatusTypeEnum } from "./EditingStatusTypeEnum"

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
  const [checked, setChecked] = useState(defaultChecked)

  return (
    <label className="text-sm">
      <input
        name={type}
        className="mr-2"
        type="checkbox"
        checked={checked}
        onChange={(e) => {
          setChecked(e.target.checked)
        }}
      />
      {label}
    </label>
  )
}
