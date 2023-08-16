export type SelectOptionValueType = string | number

export type SelectOption<T extends SelectOptionValueType> = {
  name: string
  value: T
}

interface BankSelectProps<T extends SelectOptionValueType> {
  options: SelectOption<T>[]
  defaultValue?: T
  name: string
}

export default function BankSelect<T extends SelectOptionValueType>({
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
