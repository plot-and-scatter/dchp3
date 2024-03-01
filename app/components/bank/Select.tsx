import type { InputOption } from "./InputOption"
import clsx from "clsx"
import ValidationErrorText from "../elements/Form/ValidationErrorText"

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  conformField?: any
  options: InputOption[]
  name: string
  onChange?: React.ChangeEventHandler<HTMLSelectElement>
}

export default function Select({
  conformField,
  name,
  options,
  onChange,
  className,
  ...rest
}: SelectProps) {
  const error = conformField?.errors
  const hasErrors = !!conformField?.errors && conformField?.errors.length > 0

  return (
    <>
      <select
        name={name}
        onChange={onChange}
        className={clsx(
          className || `rounded border border-gray-700 py-2 px-4`,
          hasErrors &&
            "border-primary-dark bg-primary-lightest outline-primary-dark"
        )}
        {...rest}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hasErrors && (
        <ValidationErrorText className="flex-wrap">
          {name}: {error}
        </ValidationErrorText>
      )}
    </>
  )
}
