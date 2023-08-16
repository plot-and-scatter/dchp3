interface BankInputProps {
  name: string
  defaultValue?: string | number
  showField?: boolean // If true, show the defaultValue. If not, do not.
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

export default function BankInput({
  name,
  defaultValue,
  onChange,
  showField = true,
}: BankInputProps) {
  return (
    <input
      type="text"
      name={name}
      defaultValue={showField !== false ? defaultValue : undefined}
      className="w-full rounded border border-slate-700 px-4 py-2"
      onChange={onChange}
    />
  )
}
