export type BankInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string
  defaultValue?: string | number | null
  showField?: boolean // If true, show the defaultValue. If not, do not.
}

export default function BankInput(props: BankInputProps) {
  const { defaultValue } = props
  const defaultValueNoNulls = defaultValue === null ? undefined : defaultValue

  return (
    <input
      defaultValue={props.showField !== false ? defaultValueNoNulls : undefined}
      className={
        props.className || "w-full rounded border border-slate-700 px-4 py-2"
      }
      {...props}
    />
  )
}
