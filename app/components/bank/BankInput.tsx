import ValidationErrorText from "../elements/Form/ValidationErrorText"
import clsx from "clsx"

export type BankInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "defaultValue"
> & {
  conformField?: any
  name: string
  defaultValue?: string | number | null
  showField?: boolean // If true, show the defaultValue. If not, do not.
}

export default function BankInput({
  conformField,
  name,
  defaultValue,
  className,
  showField,
  ...rest
}: BankInputProps) {
  const defaultValueNoNulls = defaultValue === null ? undefined : defaultValue

  const error = conformField?.errors
  const hasErrors = !!conformField?.errors && conformField?.errors.length > 0

  // console.log("...rest", name, rest)

  return (
    <>
      <input
        name={name}
        className={clsx(
          "my-0 w-full rounded border border-slate-700 px-4 py-2",
          className,
          hasErrors && "border-red-700 bg-red-100 outline-red-700"
        )}
        {...rest} // defaultValue MUST come after this line.
        defaultValue={showField !== false ? defaultValueNoNulls : undefined}
      />
      {hasErrors && (
        <ValidationErrorText className="flex-wrap">
          {name} {error}
        </ValidationErrorText>
      )}
    </>
  )
}
