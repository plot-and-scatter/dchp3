interface BankInputProps {
  name: string
  defaultValue?: string | number
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

export default function BankInput({
  name,
  defaultValue,
  onChange,
}: BankInputProps) {
  return (
    <input
      type="text"
      name={name}
      defaultValue={defaultValue}
      className="w-full border border-slate-700 px-4 py-2"
      onChange={onChange}
    />
  )
}
