import { z } from "zod"

// Validated on the server in the action and re-run in the browser by conform,
// so this file must not reach for Prisma or the Management API.

/** The value the role select uses for "create them with no role at all". */
export const NO_ROLE = "none"

export const CreateUserSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, "An email address is required.")
      .email("That does not look like an email address.")
      // Lower-cased here rather than at the point of use: the directory joins
      // Auth0 to the local table on a lower-cased address, and an address
      // stored with capitals would sit on the wrong side of that join.
      .transform((value) => value.toLowerCase()),
    firstName: z
      .string()
      .trim()
      .min(1, "A first name is required, or the list shows an email address."),
    lastName: z.string().trim().min(1, "A last name is required."),
    role: z.union([
      z.literal(NO_ROLE),
      z.literal("Display"),
      z.literal("Student / Editor"),
      z.literal("Research Assistant"),
      z.literal("Superadmin"),
    ]),
    // Creating someone with no role is allowed but not by accident: the form
    // asks for this to be ticked once the warning has been read.
    acknowledgeNoRole: z.string().optional(),
  })
  .strict()
  .refine(
    (value) => value.role !== NO_ROLE || value.acknowledgeNoRole === "on",
    {
      path: ["acknowledgeNoRole"],
      message:
        "Confirm you mean to create someone who can sign in but do nothing.",
    }
  )

export type CreateUserInput = z.infer<typeof CreateUserSchema>

export const ReissuePasswordLinkSchema = z
  .object({
    intent: z.literal("password"),
    // Auth0's own id for the account, from the list. Not an email: an address
    // can carry two accounts, and a link is issued for one of them.
    auth0UserId: z.string().min(1),
  })
  .strict()

export const UpdateUserNameSchema = z
  .object({
    // The person's page has two forms; this says which one was submitted. It
    // has to be declared, because a strict schema rejects a field it has not
    // been told about -- which silently refused every save.
    intent: z.literal("name"),
    firstName: z.string().trim().min(1, "A first name is required."),
    lastName: z.string().trim().min(1, "A last name is required."),
  })
  .strict()

export type UpdateUserNameInput = z.infer<typeof UpdateUserNameSchema>

export const ChangeRoleSchema = z
  .object({
    intent: z.literal("role"),
    role: z.union([
      z.literal(NO_ROLE),
      z.literal("Display"),
      z.literal("Student / Editor"),
      z.literal("Research Assistant"),
      z.literal("Superadmin"),
    ]),
  })
  .strict()

export type ChangeRoleInput = z.infer<typeof ChangeRoleSchema>
