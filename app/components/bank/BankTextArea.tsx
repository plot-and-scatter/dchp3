interface BankTextAreaProps {
  name: string
  defaultValue?: string
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
  return (
    <textarea
      name={name}
      // defaultValue={defaultValue}
      defaultValue={showField !== false ? defaultValue : undefined}
      className={`${
        className || ""
      } w-full rounded border border-slate-700 px-4 py-2`}
      rows={rows}
      onChange={onChange}
    />
  )
}
