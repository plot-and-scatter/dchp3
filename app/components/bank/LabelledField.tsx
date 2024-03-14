export interface LabelledFieldProps {
  label: React.ReactNode
  field: React.ReactNode
  centerLabel?: boolean
  labelWidth?: string
  breakAfterLabel?: boolean
  fullWidth?: boolean
}

export default function LabelledField({
  label,
  field,
  centerLabel,
  labelWidth,
  breakAfterLabel,
  fullWidth,
}: LabelledFieldProps) {
  return (
    <div
      className={`${breakAfterLabel ? "flex-col" : ""} flex ${
        fullWidth !== false ? "min-w-full" : ""
      } ${centerLabel ? "items-center" : "items-start"} gap-x-4`}
    >
      <div className={labelWidth || "w-36"}>
        <strong>{label}</strong>
      </div>
      <div className={`${fullWidth !== false ? "w-full" : ""} flex-1`}>
        {field}
      </div>
    </div>
  )
}
