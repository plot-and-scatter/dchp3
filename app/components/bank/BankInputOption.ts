export type BankInputOptionType = string | number

export type BankInputOption<T extends BankInputOptionType> = {
  name: string
  value: T
  defaultChecked?: boolean
}
