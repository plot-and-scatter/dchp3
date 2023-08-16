import type { BankInputOption, BankInputOptionType } from "./BankInputOption"

interface BankSelectProps<T extends BankInputOptionType> {
  options: BankInputOption<T>[]
  defaultValue?: T
  name: string
  onChange?: React.ChangeEventHandler<HTMLSelectElement>
}

export default function BankSelect<T extends BankInputOptionType>({
  name,
  options,
  defaultValue,
  onChange,
}: BankSelectProps<T>) {
  return (
    <select
      name={name}
      onChange={onChange}
      className={`rounded border border-slate-700 py-2 px-4`}
    >
      {options.map((o) => (
        <option
          key={o.value}
          value={o.value}
          selected={o.value === defaultValue}
        >
          {o.name}
        </option>
      ))}
    </select>
  )
}
