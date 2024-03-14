import { z } from "zod"

export const ZPositiveInt = z.coerce.number().int().positive()
