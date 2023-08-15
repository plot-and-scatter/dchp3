interface BankTextAreaProps {
  name: string
  defaultValue?: string
  rows?: number
  className?: string
  showField?: boolean // If true, show the defaultValue. If not, do not.
}

export default function BankTextArea({
  className,
  name,
  defaultValue,
  rows,
  showField = true,
}: BankTextAreaProps) {
  return (
    <textarea
      name={name}
      defaultValue={showField !== false ? defaultValue : undefined}
      className={`${className || ""} w-full border border-slate-700 px-4 py-2`}
      rows={rows}
    />
  )
}
