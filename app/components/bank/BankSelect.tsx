import type { BankInputOption } from "./BankInputOption"

type BankSelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  options: BankInputOption[]
  name: string
  onChange?: React.ChangeEventHandler<HTMLSelectElement>
}

export default function BankSelect({
  name,
  options,
  onChange,
  className,
  ...rest
}: BankSelectProps) {
  return (
    <select
      name={name}
      onChange={onChange}
      className={className || `rounded border border-slate-700 py-2 px-4`}
      {...rest}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}
