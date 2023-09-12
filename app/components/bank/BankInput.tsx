export type BankInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "defaultValue"
> & {
  name: string
  defaultValue?: string | number | null
  showField?: boolean // If true, show the defaultValue. If not, do not.
}

export default function BankInput(props: BankInputProps) {
  const { defaultValue } = props
  const defaultValueNoNulls = defaultValue === null ? undefined : defaultValue

  return (
    <input
      className={
        props.className || "w-full rounded border border-slate-700 px-4 py-2"
      }
      {...props} // defaultValue MUST come after this line.
      defaultValue={props.showField !== false ? defaultValueNoNulls : undefined}
    />
  )
}
