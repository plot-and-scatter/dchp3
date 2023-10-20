import type { BankInputProps } from "./BankInput"
import type { BankInputOption } from "./BankInputOption"
import ValidationErrorText from "../elements/Form/ValidationErrorText"

type BankCheckboxProps = BankInputProps & {
  conformField?: any
  options: BankInputOption[]
  optionSetClassName?: string
  direction?: "horizontal" | "vertical"
  type: "radio" | "checkbox"
}

export default function BankRadioOrCheckbox(props: BankCheckboxProps) {
  const {
    conformField,
    className,
    name,
    options,
    optionSetClassName,
    defaultValue,
    direction = "horizontal",
    ...rest
  } = props

  const error = conformField?.errors
  const hasErrors = !!conformField?.errors && conformField?.errors.length > 0

  return (
    <div className={className}>
      <div className={direction === "horizontal" ? "flex" : "flex-col"}>
        {options.map((o) => {
          const { label, value, defaultChecked } = o
          const idKey = `${name}-${value}`
          return (
            <span className={optionSetClassName} key={idKey}>
              <input
                value={value}
                id={idKey}
                defaultChecked={defaultChecked || value === defaultValue}
                name={name}
                {...rest}
              />
              <label htmlFor={idKey}>{label || <>&nbsp;</>}</label>
            </span>
          )
        })}
      </div>
      {hasErrors && <ValidationErrorText>{error}</ValidationErrorText>}
    </div>
  )
}
