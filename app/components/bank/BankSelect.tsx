import type { BankInputOption } from "./BankInputOption"
import clsx from "clsx"
import ValidationErrorText from "../elements/Form/ValidationErrorText"

type BankSelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  conformField?: any
  options: BankInputOption[]
  name: string
  onChange?: React.ChangeEventHandler<HTMLSelectElement>
}

export default function BankSelect({
  conformField,
  name,
  options,
  onChange,
  className,
  ...rest
}: BankSelectProps) {
  const error = conformField?.errors
  const hasErrors = !!conformField?.errors && conformField?.errors.length > 0

  return (
    <>
      <select
        name={name}
        onChange={onChange}
        className={clsx(
          className || `rounded border border-slate-700 py-2 px-4`,
          hasErrors && "border-red-700 bg-red-100 outline-red-700"
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
