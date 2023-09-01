interface BankTextAreaProps {
  name: string
  defaultValue?: string | null
  rows?: number
  className?: string
  showField?: boolean // If true, show the defaultValue. If not, do not.
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>
}

export default function BankTextArea({
  className,
  name,
  defaultValue,
  rows,
  showField = true,
  onChange,
}: BankTextAreaProps) {
  const defaultValueNoNulls = defaultValue === null ? undefined : defaultValue

  return (
    <textarea
      name={name}
      defaultValue={showField !== false ? defaultValueNoNulls : undefined}
      className={`${
        className || ""
      } w-full rounded border border-slate-700 px-4 py-2`}
      rows={rows}
      onChange={onChange}
    />
  )
}
