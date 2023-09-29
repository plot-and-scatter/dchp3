import clsx from "clsx"

type BankTextAreaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "defaultValue"
> & {
  name: string
  defaultValue?: string | number | null
  showField?: boolean // If true, show the defaultValue. If not, do not.
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
      className={clsx(
        className,
        `w-full rounded border border-slate-700 px-4 py-2`
      )}
      rows={rows}
      onChange={onChange}
    />
  )
}
