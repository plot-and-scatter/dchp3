// Adapted from https://stackoverflow.com/a/69413070/715870
export type Integer<T extends number> = number extends T
  ? never
  : `${T}` extends `${string}.${string}`
  ? never
  : T

export type PositiveInteger<T extends number> = number extends T
  ? never
  : `${T}` extends `-${string}` | `0` | `${string}.${string}`
  ? never
  : T

const numberIsInteger = <T extends number>(
  candidate: T
): candidate is Integer<T> => {
  return Number.isInteger(Number(candidate))
}

const numberIsPositiveInteger = <T extends number>(
  candidate: T
): candidate is PositiveInteger<T> => {
  return numberIsInteger(candidate) && candidate > 0
}

type CandidateNumber = string | number

export class NotANumberError extends Error {
  constructor(message: string) {
    super(message)
    this.name = `NotANumberError`
  }
}

export const toNumber = (candidate: CandidateNumber) => {
  if (!isNumber(candidate)) {
    throw new NotANumberError(
      `toNumber: candidate '${candidate}' is not a number`
    )
  }
  return Number(candidate)
}

export const isNumber = (candidate: CandidateNumber) => {
  return !isNaN(Number(candidate))
}

export const isInteger = (candidate: CandidateNumber) => {
  try {
    return numberIsInteger(toNumber(candidate))
  } catch (e) {
    if (e instanceof NotANumberError) {
      return false
    }
  }
}

export const isPositiveInteger = (candidate: CandidateNumber) => {
  try {
    return numberIsPositiveInteger(toNumber(candidate))
  } catch (e) {
    if (e instanceof NotANumberError) {
      return false
    }
  }
}
