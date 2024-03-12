import type { InputOption } from "./InputOption"
import clsx from "clsx"
import ValidationErrorText from "../elements/Form/ValidationErrorText"

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  conformField?: any
  options: InputOption[]
  name: string
  onChange?: React.ChangeEventHandler<HTMLSelectElement>
  lightBorder?: boolean
}

export default function Select({
  conformField,
  name,
  options,
  onChange,
  className,
  lightBorder,
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
          lightBorder ? `border-gray-300` : `border-gray-700`,
          className || `rounded border py-2 px-4`,
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
