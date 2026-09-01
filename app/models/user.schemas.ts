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
