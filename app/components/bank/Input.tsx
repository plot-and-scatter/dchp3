import ValidationErrorText from "../elements/Form/ValidationErrorText"
import clsx from "clsx"

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "defaultValue"
> & {
  conformField?: any
  name: string
  defaultValue?: string | number | null
  showField?: boolean // If true, show the defaultValue. If not, do not.
}

export default function Input({
  conformField,
  name,
  defaultValue,
  className,
  showField,
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
          "my-0 w-full rounded border border-gray-700 px-4 py-2",
          className,
          hasErrors &&
            "border-primary-dark bg-primary-lightest outline-primary-dark"
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