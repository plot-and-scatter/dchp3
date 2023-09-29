export interface LabelledFieldProps {
  label: React.ReactNode
  field: React.ReactNode
}

export default function LabelledField({ label, field }: LabelledFieldProps) {
  return (
    <div className="flex min-w-full items-start gap-x-4">
      <div className="w-36">
        <strong>{label}</strong>
      </div>
      <div className="w-full flex-1">{field}</div>
    </div>
  )
}
