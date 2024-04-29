import { z } from "zod"

export const ZOptionalStringToEmptyString = z
  .string()
  .optional()
  .transform((s) => (s === undefined ? "" : s))
