import type { BankInputOption } from "~/components/bank/BankInputOption"

export type EnumLike = any // TODO: Fix.

export const enumToOptions = (enumLike: EnumLike): BankInputOption[] => {
  const options = Object.keys(enumLike)
    .filter((enumKey) => !Number.isInteger(parseInt(enumKey)))
    .map((enumKey) => {
      return { label: `${enumKey}`, value: enumLike[enumKey] }
    })

  return options
}

export const enumValues = (enumLike: EnumLike): string[] => {
  const values = Object.keys(enumLike)
    .filter((enumKey) => !Number.isInteger(parseInt(enumKey)))
    .map((enumKey) => enumLike[enumKey])

  return values
}
