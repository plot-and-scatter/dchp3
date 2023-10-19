import { useField } from "remix-validated-form"
import type { BankInputProps } from "./BankInput"
import type { BankInputOption } from "./BankInputOption"
import ValidationErrorText from "../elements/Form/ValidationErrorText"

type BankCheckboxProps = BankInputProps & {
  options: BankInputOption[]
  optionSetClassName?: string
  direction?: "horizontal" | "vertical"
  type: "radio" | "checkbox"
}

export default function BankRadioOrCheckbox(props: BankCheckboxProps) {
  const {
    className,
    name,
    options,
    optionSetClassName,
    defaultValue,
    direction = "horizontal",
    ...rest
  } = props
  const { error, getInputProps } = useField(name)

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
                {...getInputProps({ id: idKey })}
              />
              <label htmlFor={idKey}>{label || <>&nbsp;</>}</label>
            </span>
          )
        })}
      </div>
      {error && <ValidationErrorText>{error}</ValidationErrorText>}
    </div>
  )
}
