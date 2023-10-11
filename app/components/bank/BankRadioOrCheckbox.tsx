import type { BankInputProps } from "./BankInput"
import type { BankInputOption, BankInputOptionType } from "./BankInputOption"

type BankCheckboxProps<T extends BankInputOptionType> = BankInputProps & {
  options: BankInputOption<T>[]
  optionSetClassName?: string
  type: "radio" | "checkbox"
}

export default function BankRadioOrCheckbox<T extends BankInputOptionType>(
  props: BankCheckboxProps<T>
) {
  const { className, options, optionSetClassName, defaultValue, ...rest } =
    props
  return (
    <div className={className}>
      {options.map((o) => {
        const { name, value, defaultChecked } = o
        const idKey = `${name}-${value}`
        return (
          <span className={optionSetClassName} key={idKey}>
            <input
              value={value}
              id={idKey}
              defaultChecked={defaultChecked || value === defaultValue}
              {...rest}
            />
            <label htmlFor={idKey}>{name}</label>
          </span>
        )
      })}
    </div>
  )
}
