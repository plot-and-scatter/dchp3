import ValidationErrorText from "../elements/Form/ValidationErrorText"
import clsx from "clsx"

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "defaultValue"
> & {
  conformField?: any
  name: string
  defaultValue?: string | number | null | readonly string[]
  showField?: boolean // If true, show the defaultValue. If not, do not.
  lightBorder?: boolean
}

export default function Input({
  conformField,
  name,
  defaultValue,
  className,
  showField,
  lightBorder,
  ...rest
}: InputProps) {
  const defaultValueNoNulls = defaultValue === null ? undefined : defaultValue

  const error = conformField?.errors
  const hasErrors = !!conformField?.errors && conformField?.errors.length > 0

  return (
    <>
      <input
        name={name}
        className={clsx(
          lightBorder ? `border-gray-300` : `border-gray-700`,
          "my-0 w-full rounded border px-4 py-2",
          className,
          hasErrors &&
            "border-primary-dark bg-primary-lightest outline-primary-dark"
        )}
        {...rest} // defaultValue MUST come after this line.
        defaultValue={showField !== false ? defaultValueNoNulls : undefined}
      />
      {hasErrors && (
        <ValidationErrorText className="flex-wrap">{error}</ValidationErrorText>
      )}
    </>
  )
}
