import { Form, useNavigation } from "react-router"
import { getFormProps, getInputProps, useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import { useState } from "react"
import Button from "~/components/elements/LinksAndButtons/Button"
import { SecondaryHeader } from "~/components/elements/Headings/SecondaryHeader"
import {
  CreateUserSchema,
  NO_ROLE,
  UserActionEnum,
} from "~/models/user.schemas"
import { AUTH_ROLES } from "~/services/auth/AuthRole"

// A first and last name are required rather than optional. Without them the
// list shows an email address where a name should be, and the login path would
// later derive one by splitting a display name on a space -- which for an
// account created here puts the whole address in first_name.

export default function CreateUserForm({
  lastResult,
}: {
  lastResult?: Parameters<typeof useForm>[0] extends never ? never : unknown
}) {
  const navigation = useNavigation()
  const submitting = navigation.state === "submitting"

  const [form, fields] = useForm({
    lastResult: lastResult as never,
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: CreateUserSchema }),
    shouldValidate: "onBlur",
  })

  const [role, setRole] = useState<string>(AUTH_ROLES[0])
  const noRole = role === NO_ROLE

  return (
    <Form method="post" {...getFormProps(form)} className="max-w-xl">
      <input
        type="hidden"
        name="userAction"
        value={UserActionEnum.CREATE_USER}
      />

      <SecondaryHeader>Add someone</SecondaryHeader>

      <div className="mt-4 flex flex-col gap-4">
        <Field
          label="Email address"
          hint="Used to sign in, and to match them to any work already in the database."
          error={fields.email.errors?.[0]}
        >
          <input
            {...getInputProps(fields.email, { type: "email" })}
            className="w-full border border-gray-400 p-2"
            autoComplete="off"
          />
        </Field>

        <div className="flex gap-4">
          <Field label="First name" error={fields.firstName.errors?.[0]}>
            <input
              {...getInputProps(fields.firstName, { type: "text" })}
              className="w-full border border-gray-400 p-2"
              autoComplete="off"
            />
          </Field>
          <Field label="Last name" error={fields.lastName.errors?.[0]}>
            <input
              {...getInputProps(fields.lastName, { type: "text" })}
              className="w-full border border-gray-400 p-2"
              autoComplete="off"
            />
          </Field>
        </div>

        <Field
          label="Role"
          hint="Decides what they can do. It can be changed afterwards."
          error={fields.role.errors?.[0]}
        >
          <select
            {...getInputProps(fields.role, { type: "text" })}
            className="w-full border border-gray-400 bg-white p-2"
            value={role}
            onChange={(event) => setRole(event.target.value)}
          >
            {AUTH_ROLES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
            <option value={NO_ROLE}>No role</option>
          </select>
        </Field>

        {noRole && (
          <div
            role="alert"
            className="border-l-4 border-alert-500 bg-alert-50 p-4"
          >
            <p className="font-semibold">
              They will be able to sign in and do nothing.
            </p>
            <p className="mt-1">
              Someone with no role holds no permission at all, not even reading
              the citation bank. This is the same state an account gets by
              signing itself up, so it is worth being deliberate about.
            </p>
            <label className="mt-2 flex items-center gap-2">
              <input type="checkbox" name="acknowledgeNoRole" />
              <span>Create them without a role anyway</span>
            </label>
            {fields.acknowledgeNoRole.errors?.[0] && (
              <p className="mt-1 text-red-800">
                {fields.acknowledgeNoRole.errors[0]}
              </p>
            )}
          </div>
        )}

        <p className="text-gray-700">
          No password is set here. Auth0 gets one nobody sees, and you are given
          a one-time link for them to choose their own.
        </p>

        <div>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Creating…" : "Create user"}
          </Button>
        </div>
      </div>
    </Form>
  )
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <label className="block w-full">
      <span className="font-semibold">{label}</span>
      {hint && <span className="block text-sm text-gray-600">{hint}</span>}
      <span className="mt-1 block">{children}</span>
      {error && <span className="mt-1 block text-red-800">{error}</span>}
    </label>
  )
}
