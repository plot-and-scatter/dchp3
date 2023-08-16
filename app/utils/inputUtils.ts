export type EnumLike = any // TODO: Fix.

export const enumToSelectOptions = (enumLike: EnumLike) => {
  const options = Object.keys(enumLike)
    .filter((enumKey) => !Number.isInteger(parseInt(enumKey)))
    .map((enumKey) => {
      return { name: `${enumKey}`, value: enumLike[enumKey] }
    })

  return options
}