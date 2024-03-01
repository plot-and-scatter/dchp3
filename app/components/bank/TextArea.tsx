import clsx from "clsx"
import ValidationErrorText from "../elements/Form/ValidationErrorText"

type TextAreaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "defaultValue"
> & {
  conformField?: any
  name: string
  defaultValue?: string | number | null
  showField?: boolean // If true, show the defaultValue. If not, do not.
}

export default function TextArea({
  conformField,
  className,
  name,
  defaultValue,
  showField = true,
  ...rest
}: TextAreaProps) {
  const defaultValueNoNulls = defaultValue === null ? undefined : defaultValue

  const error = conformField?.errors
  const hasErrors = !!conformField?.errors && conformField?.errors.length > 0

  return (
    <>
      <textarea
        defaultValue={showField !== false ? defaultValueNoNulls : undefined}
        name={name}
        className={clsx(
          className,
          `w-full rounded border border-gray-700 px-4 py-2`,
          hasErrors &&
            "border-primary-dark bg-primary-lightest outline-primary-dark"
        )}
        {...rest}
      />
      {hasErrors && (
        <ValidationErrorText className="flex-wrap">{error}</ValidationErrorText>
      )}
    </>
  )
}
