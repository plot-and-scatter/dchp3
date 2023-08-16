import type { BankInputOption, BankInputOptionType } from "./BankInputOption"

interface BankSelectProps<T extends BankInputOptionType> {
  options: BankInputOption<T>[]
  defaultValue?: T
  name: string
}

export default function BankSelect<T extends BankInputOptionType>({
  name,
  options,
  defaultValue,
}: BankSelectProps<T>) {
  return (
    <select name={name} className={`rounded border border-slate-700 py-2 px-4`}>
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
