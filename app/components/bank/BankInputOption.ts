export type BankInputOptionType = string | number

export type BankInputOption<T extends BankInputOptionType> = {
  label: string
  value: T
  defaultChecked?: boolean
}
