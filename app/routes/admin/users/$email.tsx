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
import ActionButton from "~/components/elements/LinksAndButtons/ActionButton"
import {
  loginBadge,
  renderBadge,
  roleBadges,
} from "~/components/admin/userBadges"
import PasswordLinkPanel from "~/components/admin/PasswordLinkPanel"
import TransientNotice from "~/components/elements/TransientNotice"
import {
  ChangeRoleSchema,
  NO_ROLE,
  ReissuePasswordLinkSchema,
  UpdateUserNameSchema,
} from "~/models/user.schemas"
import { reissuePasswordLink } from "~/services/auth/createUser.server"
import {
  changeUserRole,
  updateUserName,
} from "~/services/auth/updateUser.server"
import { getDirectoryUserByEmail } from "~/services/auth/userDirectory.server"
import { redirectIfUserLacksPermission } from "~/services/auth/session.server"
import {
  totalContributions,
  type DirectoryUser,
} from "~/services/auth/userDirectory"
import { AUTH_ROLES } from "~/services/auth/AuthRole"
import { getEmailFromSession } from "~/services/auth/session.server"
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

  const formData = await request.formData()

  // The person is read first either way: both branches act on them, and the
  // account id posted by the password form has to be checked against them.
  const { user } = await getDirectoryUserByEmail(params.email ?? "")
  if (!user) {
    return { kind: "error" as const, message: "Nobody found for that address." }
  }

  const intent = formData.get("intent")

  if (intent === "role") {
    const submission = parseWithZod(formData, { schema: ChangeRoleSchema })
    if (submission.status !== "success") {
      return { kind: "error" as const, message: "That was not a valid role." }
    }

    // Changing your own role is refused. Demoting yourself removes the
    // permission this page needs, so the mistake takes away the means of
    // undoing it.
    const ownEmail = await getEmailFromSession(request)
    if (ownEmail && ownEmail.trim().toLowerCase() === user.email) {
      return {
        kind: "error" as const,
        message:
          "You cannot change your own role here. Ask another Superadmin, or do it in the Auth0 dashboard.",
      }
    }

    const result = await changeUserRole(user, submission.value)

    return result.ok
      ? { kind: "roleChanged" as const, warnings: result.warnings }
      : {
          kind: "error" as const,
          message: `The role was not changed. ${result.warnings.join(" ")}`,
        }
  }

  if (intent === "name") {
    const submission = parseWithZod(formData, { schema: UpdateUserNameSchema })
    if (submission.status !== "success") {
      return { kind: "invalidName" as const, result: submission.reply() }
    }

    const result = await updateUserName(user, submission.value)

    return result.ok
      ? { kind: "saved" as const, warnings: result.warnings }
      : {
          kind: "error" as const,
          message: `The name was not changed. ${result.warnings.join(" ")}`,
        }
  }

  if (intent !== "password") {
    return { kind: "error" as const, message: "That was not a valid request." }
  }

  const submission = parseWithZod(formData, {
    schema: ReissuePasswordLinkSchema,
  })

  if (submission.status !== "success") {
    return { kind: "error" as const, message: "That was not a valid request." }
  }

  // The posted id is checked against the accounts on this address rather than
  // trusted: it arrives from the browser, and a link may only be minted for
  // the person whose page this is.
  const owned = user.auth0Accounts.some(
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

      {actionData?.kind === "roleChanged" &&
        (actionData.warnings.length === 0 ? (
          <TransientNotice
            resetKey={actionData}
            className="my-4 border-l-4 border-green-500 bg-green-50 p-4"
          >
            Role changed. It applies the next time they sign in.
          </TransientNotice>
        ) : (
          <div className="my-4 border-l-4 border-alert-500 bg-alert-50 p-4">
            <p>Role changed, but not everywhere.</p>
            {actionData.warnings.map((warning) => (
              <p key={warning} className="mt-1 text-alert-800">
                {warning}
              </p>
            ))}
          </div>
        ))}

      <RoleForm user={user} />

      <NameForm
        user={user}
        errors={
          actionData?.kind === "invalidName"
            ? actionData.result.error ?? undefined
            : undefined
        }
      />

      {actionData?.kind === "saved" &&
        (actionData.warnings.length === 0 ? (
          <TransientNotice
            resetKey={actionData}
            className="my-4 border-l-4 border-green-500 bg-green-50 p-4"
          >
            Name saved.
          </TransientNotice>
        ) : (
          // A save that only half worked is something to act on, so it stays.
          <div className="my-4 border-l-4 border-alert-500 bg-alert-50 p-4">
            <p>Name saved, but not everywhere.</p>
            {actionData.warnings.map((warning) => (
              <p key={warning} className="mt-1 text-alert-800">
                {warning}
              </p>
            ))}
          </div>
        ))}

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
            <input type="hidden" name="intent" value="password" />
            {user.auth0Accounts.map((account) => (
              <ActionButton
                key={account.userId}
                formIntent="password"
                name="auth0UserId"
                value={account.userId}
                appearance="action"
                className="mr-2"
                submittingElement="Making a link…"
              >
                Make a password link
                {user.auth0Accounts.length > 1 &&
                  (account.connection === "google-oauth2"
                    ? " (Google)"
                    : " (email and password)")}
              </ActionButton>
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

/**
 * Their name, editable. It is written to the DCHP database and to Auth0
 * both, because the list reads whichever it finds first and writing only one
 * would leave the name on screen unchanged after an apparently successful
 * save.
 */
function NameForm({
  user,
  errors,
}: {
  user: {
    name: string
    localRows: { first_name: string | null; last_name: string | null }[]
  }
  /** Field errors from a refused save, so the refusal is not silent. */
  errors?: Record<string, string[] | null | undefined>
}) {
  const row = user.localRows[0]
  const [first, ...rest] = user.name.split(" ")

  return (
    <Form method="post" className="my-6 max-w-md">
      <input type="hidden" name="intent" value="name" />
      <SecondaryHeader>Name</SecondaryHeader>
      <div className="mt-2 flex gap-4">
        <label className="block w-full">
          <span className="font-semibold">First name</span>
          <input
            name="firstName"
            defaultValue={row?.first_name ?? first ?? ""}
            className="mt-1 w-full border border-gray-400 p-2"
          />
          {errors?.firstName?.[0] && (
            <span className="mt-1 block text-red-800">
              {errors.firstName[0]}
            </span>
          )}
        </label>
        <label className="block w-full">
          <span className="font-semibold">Last name</span>
          <input
            name="lastName"
            defaultValue={row?.last_name ?? rest.join(" ")}
            className="mt-1 w-full border border-gray-400 p-2"
          />
          {errors?.lastName?.[0] && (
            <span className="mt-1 block text-red-800">
              {errors.lastName[0]}
            </span>
          )}
        </label>
      </div>
      <ActionButton
        formIntent="name"
        appearance="action"
        className="mt-2"
        submittingElement="Saving…"
      >
        Save name
      </ActionButton>
    </Form>
  )
}

/**
 * Their role, which is what decides everything they can do.
 *
 * The note about signing in again is not a nicety: roles reach the application
 * on a claim in the login token, so a change does nothing for a session that
 * is already open. Without saying so, an administrator changes a role, watches
 * the person report that nothing happened, and changes it again.
 */
function RoleForm({ user }: { user: DirectoryUser }) {
  if (user.auth0Accounts.length === 0) {
    return (
      <div className="my-6 max-w-md">
        <SecondaryHeader>Role</SecondaryHeader>
        <p className="mt-2 text-gray-700">
          Roles live in Auth0, and they have no account there, so there is no
          role to set.
        </p>
      </div>
    )
  }

  return (
    <Form method="post" className="my-6 max-w-md">
      <input type="hidden" name="intent" value="role" />
      <SecondaryHeader>Role</SecondaryHeader>
      <p className="mt-2 text-gray-700">
        Takes effect the next time they sign in. Roles arrive with the sign-in,
        so a session already open keeps the old one until it ends.
      </p>
      <select
        name="role"
        defaultValue={user.roles[0] ?? NO_ROLE}
        className="mt-2 w-full border border-gray-400 bg-white p-2"
      >
        {AUTH_ROLES.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
        <option value={NO_ROLE}>No role</option>
      </select>
      {user.auth0Accounts.length > 1 && (
        <p className="mt-2 text-sm text-gray-600">
          Applied to both of their Auth0 accounts, so it does not depend on
          which one they sign in with.
        </p>
      )}
      <ActionButton
        formIntent="role"
        appearance="action"
        className="mt-2"
        submittingElement="Changing…"
      >
        Change role
      </ActionButton>
    </Form>
  )
}
