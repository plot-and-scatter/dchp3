import { z } from "zod"

export const ZCheckboxValueToNullableInt = z
  .union([z.literal("true"), z.literal("false")])
  .optional()
  .nullable()
  .transform((val) => (val === "true" ? 1 : null))
