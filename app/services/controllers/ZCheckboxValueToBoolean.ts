import { z } from "zod"

export const ZCheckboxValueToBoolean = z
  .union([z.literal("true"), z.literal("false")])
  .optional()
  .nullable()
  .transform((val) => (val === "true" ? true : false))
