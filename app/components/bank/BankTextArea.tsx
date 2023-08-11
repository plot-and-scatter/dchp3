interface BankTextAreaProps {
  name: string
  defaultValue?: string
  rows?: number
  className?: string
}

export default function BankTextArea({
  className,
  name,
  defaultValue,
  rows,
}: BankTextAreaProps) {
  return (
    <textarea
      name={name}
      defaultValue={defaultValue}
      className={`${className || ""} w-full border border-slate-700 px-4 py-2`}
      rows={rows}
    />
  )
}
