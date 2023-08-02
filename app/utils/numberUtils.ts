export function isNonPositive(number: number) {
  return number <= 0
}

export function assertIsValidId(id: number) {
  if (isNaN(id)) {
    throw new Error(`Given ID must be a number`)
  } else if (isNonPositive(id)) {
    throw new Error(`Given ID must be positive`)
  }
}
