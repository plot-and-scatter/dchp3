import { useField } from "remix-validated-form"
import ValidationErrorText from "../elements/Form/ValidationErrorText"
import clsx from "clsx"

export type BankInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "defaultValue"
> & {
  name: string
  defaultValue?: string | number | null
  showField?: boolean // If true, show the defaultValue. If not, do not.
}

export default function BankInput({
  name,
  defaultValue,
  className,
  showField,
  ...rest
}: BankInputProps) {
  const { error, getInputProps } = useField(name)
  const defaultValueNoNulls = defaultValue === null ? undefined : defaultValue

  return (
    <>
      <input
        className={clsx(
          "my-0 w-full rounded border border-slate-700 px-3 py-2 invalid:border-green-500",
          className,
          error && "border-red-700 bg-red-100 outline-red-700"
        )}
        {...getInputProps({ id: name })}
        {...rest} // defaultValue MUST come after this line.
        defaultValue={showField !== false ? defaultValueNoNulls : undefined}
      />
      {error && (
        <ValidationErrorText className="flex-wrap">{error}</ValidationErrorText>
      )}
    </>
  )
}
