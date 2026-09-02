import { type ActionFunctionArgs } from "react-router"
import { useActionData } from "react-router"
import { parseWithZod } from "@conform-to/zod"
import { PageHeader } from "~/components/elements/Headings/PageHeader"
import { Link } from "~/components/elements/LinksAndButtons/Link"
import CreateUserForm from "~/components/admin/CreateUserForm"
import PasswordLinkPanel from "~/components/admin/PasswordLinkPanel"
import { CreateUserSchema } from "~/models/user.schemas"
import { createUser } from "~/services/auth/createUser.server"
import { redirectIfUserLacksPermission } from "~/services/auth/session.server"
import { MANAGE_USERS_PERMISSION } from "../users"

// Adding someone is its own page rather than a form above the list. It is a
// task with its own outcome -- a one-time link that has to be handed over --
// and it does not belong on the screen used for looking things up.
//
// There is no redirect on success, deliberately: the link is shown once and
// never stored, so redirecting to the list would throw it away.

export const action = async ({ request }: ActionFunctionArgs) => {
  await redirectIfUserLacksPermission(request, MANAGE_USERS_PERMISSION)

  const submission = parseWithZod(await request.formData(), {
    schema: CreateUserSchema,
  })

  if (submission.status !== "success") {
    // Returned rather than thrown, so conform can put each message beside the
    // field it belongs to.
    return { kind: "invalid" as const, result: submission.reply() }
  }

  const result = await createUser(submission.value)

  return result.ok
    ? {
        kind: "created" as const,
        ticketUrl: result.ticketUrl,
        warnings: result.warnings,
        email: submission.value.email,
      }
    : { kind: "error" as const, message: result.message }
}

export default function NewUser() {
  const actionData = useActionData<typeof action>()

  return (
    <div className="mt-8">
      <PageHeader>Add someone</PageHeader>

      <p className="my-4">
        <Link to="/admin/users">Back to the list</Link>
      </p>

      {actionData?.kind === "error" && (
        <div
          role="alert"
          className="my-4 max-w-xl border-l-4 border-red-500 bg-red-50 p-4"
        >
          {actionData.message}
        </div>
      )}

      {actionData?.kind === "created" ? (
        <div className="max-w-xl">
          <PasswordLinkPanel
            ticketUrl={actionData.ticketUrl}
            warnings={actionData.warnings}
            created={actionData.email}
          />
          <p className="my-4">
            <Link to="/admin/users">Back to the list</Link>
          </p>
        </div>
      ) : (
        <CreateUserForm
          lastResult={
            actionData?.kind === "invalid" ? actionData.result : undefined
          }
        />
      )}
    </div>
  )
}
