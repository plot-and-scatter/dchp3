import { useField } from "remix-validated-form"
import type { BankInputProps } from "./BankInput"
import type { BankInputOption, BankInputOptionType } from "./BankInputOption"
import ValidationErrorText from "../elements/Form/ValidationErrorText"

type BankCheckboxProps<T extends BankInputOptionType> = BankInputProps & {
  options: BankInputOption<T>[]
  optionSetClassName?: string
  direction?: "horizontal" | "vertical"
  type: "radio" | "checkbox"
}

export default function BankRadioOrCheckbox<T extends BankInputOptionType>(
  props: BankCheckboxProps<T>
) {
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
