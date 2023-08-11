interface BankNumericInputProps {
  name: string
  defaultValue?: string | number
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

export default function BankNumericInput({
  name,
  defaultValue,
  onChange,
}: BankNumericInputProps) {
  return (
    <input
      type="number"
      name={name}
      defaultValue={defaultValue}
      className="w-32 border border-slate-700 px-4 py-2"
      onChange={onChange}
      min={0}
    />
  )
}
