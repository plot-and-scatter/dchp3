interface BankInputProps {
  name: string
  defaultValue?: string | number
  showField?: boolean // If true, show the defaultValue. If not, do not.
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  value?: string | number
  hidden?: boolean
}

export default function BankInput({
  name,
  defaultValue,
  onChange,
  showField = true,
  value,
  hidden,
}: BankInputProps) {
  return (
    <input
      type="text"
      name={name}
      defaultValue={showField !== false ? defaultValue : undefined}
      className="w-full rounded border border-slate-700 px-4 py-2"
      onChange={onChange}
      value={value}
      hidden={hidden}
    />
  )
}
