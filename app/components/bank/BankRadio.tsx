import type { BankInputOption, BankInputOptionType } from "./BankInputOption"

interface BankRadioProps<T extends BankInputOptionType> {
  name: string
  defaultValue?: string | number
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  options: BankInputOption<T>[]
  optionSetClassName?: string
  className?: string
}

export default function BankRadio<T extends BankInputOptionType>({
  name: inputName,
  defaultValue,
  onChange,
  options,
  optionSetClassName,
  className,
}: BankRadioProps<T>) {
  return (
    <div className={className}>
      {options.map((o) => {
        const { name, value } = o
        const idKey = `${name}-${value}`
        return (
          <span className={optionSetClassName} key={idKey}>
            <input
              name={inputName}
              type="radio"
              value={value}
              id={idKey}
              defaultChecked={value === defaultValue}
            />
            <label htmlFor={idKey}>{name}</label>
          </span>
        )
      })}
    </div>
  )
}
