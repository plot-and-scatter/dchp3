import { z } from "zod"
import { ZPositiveInt } from "~/services/controllers/ZPositiveInt"

// The reference form schemas are isomorphic: the routes below validate with
// them on the server in their `action`, and conform re-runs the same schemas
// in the browser via `onValidate`. They therefore must not reach for Prisma.
// They used to sit in app/routes/references/*.ts next to the mutations that
// use them, which pulled ~/db.server into the client bundle. The mutations
// now live in reference.server.ts.

export enum ReferenceActionEnum {
  CREATE_REFERENCE = "CreateReference",
  UPDATE_REFERENCE = "UpdateReference",
  DELETE_REFERENCE = "DeleteReference",
}

export const CreateReferenceSchema = z
  .object({
    referenceAction: z.literal(ReferenceActionEnum.CREATE_REFERENCE),
    shortDisplay: z.string(),
    referenceText: z.string(),
  })
  .strict()

export const UpdateReferenceSchema = z
  .object({
    referenceAction: z.literal(ReferenceActionEnum.UPDATE_REFERENCE),
    shortDisplay: z.string(),
    referenceText: z.string(),
    id: ZPositiveInt,
  })
  .strict()

export const DeleteReferenceSchema = z
  .object({
    referenceAction: z.literal(ReferenceActionEnum.DELETE_REFERENCE),
    id: ZPositiveInt,
  })
  .strict()
