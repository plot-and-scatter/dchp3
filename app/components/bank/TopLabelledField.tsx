import clsx from "clsx"
import type { LabelledFieldProps } from "./LabelledField"

export default function TopLabelledField({
  label,
  field,
  labelWidth,
}: LabelledFieldProps) {
  return (
    <div className="flex flex-col gap-y-1">
      <div className={clsx(labelWidth || "w-36")}>
        <strong>{label}</strong>
      </div>
      <div className="w-full flex-1">{field}</div>
    </div>
  )
}
