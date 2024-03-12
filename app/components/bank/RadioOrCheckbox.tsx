import type { InputProps } from "./Input"
import type { InputOption } from "./InputOption"
import ValidationErrorText from "../elements/Form/ValidationErrorText"

type RadioOrCheckboxProps = InputProps & {
  conformField?: any
  options: InputOption[]
  optionSetClassName?: string
  inputClassName?: string
  direction?: "horizontal" | "vertical"
  type: "radio" | "checkbox"
}

export default function RadioOrCheckbox(props: RadioOrCheckboxProps) {
  const {
    conformField,
    className,
    name,
    options,
    optionSetClassName,
    inputClassName,
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
                className={inputClassName} // This line MUST be here.
              />
              {label && <label htmlFor={idKey}>{label || <>&nbsp;</>}</label>}
            </span>
          )
        })}
      </div>
      {hasErrors && <ValidationErrorText>{error}</ValidationErrorText>}
    </div>
  )
}
