import {
  data,
  Form,
  useActionData,
  useLoaderData,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router"
import { parseWithZod } from "@conform-to/zod"
import { PageHeader } from "~/components/elements/Headings/PageHeader"
import { SecondaryHeader } from "~/components/elements/Headings/SecondaryHeader"
import { Link } from "~/components/elements/LinksAndButtons/Link"
import Button from "~/components/elements/LinksAndButtons/Button"
import {
  loginBadge,
  renderBadge,
  roleBadges,
} from "~/components/admin/userBadges"
import PasswordLinkPanel from "~/components/admin/PasswordLinkPanel"
import { ReissuePasswordLinkSchema } from "~/models/user.schemas"
import { reissuePasswordLink } from "~/services/auth/createUser.server"
import { getDirectoryUserByEmail } from "~/services/auth/userDirectory.server"
import { redirectIfUserLacksPermission } from "~/services/auth/session.server"
import { totalContributions } from "~/services/auth/userDirectory"
import { MANAGE_USERS_PERMISSION } from "../users"

// One person, and everything done to them. Changing a role is #444 and
// deactivating is #445; both belong here rather than on a row of the list,
// which is read to look things up.
//
// Keyed by email address, matching /profile/$userEmail and the key the
// directory joins Auth0 to the local table on. A person can hold two Auth0
// accounts on one address, so this page is about a person, not an account --
// which is why anything done to an account is offered once per account.

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  await redirectIfUserLacksPermission(request, MANAGE_USERS_PERMISSION)

  const email = params.email ?? ""
  const { user, auth0Error } = await getDirectoryUserByEmail(email)

  if (!user) {
    throw data({ message: `Nobody found for ${email}` }, { status: 404 })
  }

  return { user, auth0Error }
}

export const action = async ({ params, request }: ActionFunctionArgs) => {
  await redirectIfUserLacksPermission(request, MANAGE_USERS_PERMISSION)

  const submission = parseWithZod(await request.formData(), {
    schema: ReissuePasswordLinkSchema,
  })

  if (submission.status !== "success") {
    return { kind: "error" as const, message: "That was not a valid request." }
  }

  // The posted id is checked against the accounts on this address rather than
  // trusted: it arrives from the browser, and a link may only be minted for
  // the person whose page this is.
  const { user } = await getDirectoryUserByEmail(params.email ?? "")
  const owned = user?.auth0Accounts.some(
    (account) => account.userId === submission.value.auth0UserId
  )

  if (!owned) {
    return {
      kind: "error" as const,
      message: "That account does not belong to this person.",
    }
  }

  const result = await reissuePasswordLink(submission.value.auth0UserId)

  return result.ok
    ? { kind: "link" as const, ticketUrl: result.ticketUrl, warnings: [] }
    : {
        kind: "error" as const,
        message: `Could not make a password link. ${result.message}`,
      }
}

export default function AdminUser() {
  const { user } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()

  return (
    <div className="mt-8 max-w-3xl">
      <PageHeader>{user.name}</PageHeader>

      <p className="my-4">
        <Link to="/admin/users">Back to the list</Link>
      </p>

      <dl className="my-4 grid grid-cols-[10rem_1fr] gap-y-2">
        <dt className="font-semibold">Email</dt>
        <dd>{user.email ?? "None"}</dd>

        <dt className="font-semibold">Role</dt>
        <dd>{roleBadges(user).map((badge) => renderBadge(badge))}</dd>

        <dt className="font-semibold">Auth0 login</dt>
        <dd>{renderBadge(loginBadge(user))}</dd>

        <dt className="font-semibold">Contributions</dt>
        <dd>
          {totalContributions(user).toLocaleString()} —{" "}
          {user.contributions.edits} entry edits, {user.contributions.citations}{" "}
          citations
        </dd>

        <dt className="font-semibold">Auth0 accounts</dt>
        <dd>
          {user.auth0Accounts.length === 0
            ? "None. They contributed before this site used Auth0 and cannot sign in."
            : user.auth0Accounts.map((account) => (
                <span key={account.userId} className="block">
                  {account.connection === "google-oauth2"
                    ? "Google"
                    : "Email and password"}
                  {account.blocked && " — blocked"}
                </span>
              ))}
        </dd>
      </dl>

      {actionData?.kind === "error" && (
        <div
          role="alert"
          className="my-4 border-l-4 border-red-500 bg-red-50 p-4"
        >
          {actionData.message}
        </div>
      )}

      {actionData?.kind === "link" && (
        <PasswordLinkPanel
          ticketUrl={actionData.ticketUrl}
          warnings={actionData.warnings}
        />
      )}

      {user.auth0Accounts.length > 0 && (
        <div className="my-6">
          <SecondaryHeader>Password</SecondaryHeader>
          <p className="my-2">
            Make a link they can use to choose their own password. It works once
            and lasts a week. Nothing is sent for you, so pass it on however
            suits — and make another whenever one runs out.
          </p>
          <Form method="post">
            {user.auth0Accounts.map((account) => (
              <Button
                key={account.userId}
                type="submit"
                name="auth0UserId"
                value={account.userId}
                appearance="secondary"
                className="mr-2"
              >
                Make a password link
                {user.auth0Accounts.length > 1 &&
                  (account.connection === "google-oauth2"
                    ? " (Google)"
                    : " (email and password)")}
              </Button>
            ))}
          </Form>
          {user.auth0Accounts.some((a) => a.connection === "google-oauth2") && (
            <p className="mt-2 text-sm text-gray-600">
              A Google account has no password here, so a link for it is rarely
              what you want.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
