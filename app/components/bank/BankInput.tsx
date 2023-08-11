interface BankInputProps {
  name: string
  defaultValue?: string | number
}

export default function BankInput({ name, defaultValue }: BankInputProps) {
  return (
    <input
      type="text"
      name={name}
      defaultValue={defaultValue}
      className="w-full border border-slate-700 px-4 py-2"
    />
  )
}
