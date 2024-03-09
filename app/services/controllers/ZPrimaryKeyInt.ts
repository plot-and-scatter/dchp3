import { z } from "zod"

export const ZPrimaryKeyInt = z.coerce.number().int().positive()
