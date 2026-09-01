import StatusBadge, {
  type BadgeTone,
} from "~/components/elements/Labels/StatusBadge"
// Not from userDirectory.server: isPartiallyBlocked is a value, and importing
// it from the server module pulls ~/db.server into the client bundle.
import {
  isPartiallyBlocked,
  type DirectoryUser,
} from "~/services/auth/userDirectory"

// Two questions decide what an administrator does about a row, and neither was
// legible before: can this person log in, and are they allowed to do anything
// once they have. Both are badges rather than prose.

type Badge = { label: string; tone: BadgeTone; title?: string }

/** Can this person log in at all, and through how many accounts. */
export function loginBadge(user: DirectoryUser): Badge {
  if (user.presence === "auth0Unknown") {
    return {
      label: "Auth0 not read",
      tone: "neutral",
      title: "Auth0 could not be reached, so this is not known.",
    }
  }

  if (user.auth0Accounts.length === 0) {
    return {
      label: "No login",
      tone: "warning",
      title:
        "A row in this site's database with no Auth0 account. They cannot log in.",
    }
  }

  if (isPartiallyBlocked(user)) {
    return {
      label: "Partly blocked",
      tone: "danger",
      title:
        "Some of this person's Auth0 accounts are blocked and others are not, so they can still log in.",
    }
  }

  if (user.auth0Accounts.every((a) => a.blocked)) {
    return { label: "Blocked", tone: "danger", title: "Cannot log in." }
  }

  return { label: "Can log in", tone: "success" }
}

/**
 * What this person may do. An Auth0 account with no role is the case worth
 * finding: they can log in and hold no permission at all, which is what a
 * self-service signup produces.
 */
export function roleBadges(user: DirectoryUser): Badge[] {
  if (user.roles.length > 0) {
    return user.roles.map((role) => ({ label: role, tone: "neutral" }))
  }

  if (user.auth0Accounts.length > 0) {
    return [
      {
        label: "No role",
        tone: "warning",
        title:
          "Can log in but holds no role, so has no permission at all. Worth checking how this account was created.",
      },
    ]
  }

  return [{ label: "—", tone: "neutral" }]
}

const PRESENCE_BADGE: Record<DirectoryUser["presence"], Badge> = {
  both: { label: "Auth0 + database", tone: "neutral" },
  auth0Only: {
    label: "Auth0 only",
    tone: "warning",
    title: "No row in this site's database yet. One is created at first login.",
  },
  localOnly: {
    label: "Database only",
    tone: "warning",
    title: "No Auth0 account, so no way to log in.",
  },
  auth0Unknown: {
    label: "Database",
    tone: "neutral",
    title: "Auth0 could not be reached, so the other half is unknown.",
  },
}

const renderBadge = ({ label, tone, title }: Badge, key?: string) => (
  <StatusBadge key={key ?? label} tone={tone} title={title}>
    {label}
  </StatusBadge>
)

export default function UserDirectoryTable({
  users,
}: {
  users: DirectoryUser[]
}) {
  if (users.length === 0) return <p>No users found.</p>

  return (
    // The table scrolls inside its own box rather than making the page scroll
    // sideways on a narrow screen.
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-400">
            <th className="py-2 pr-4">Name</th>
            <th className="py-2 pr-4">Email</th>
            <th className="py-2 pr-4">Role</th>
            <th className="py-2 pr-4">Login</th>
            <th className="py-2">Record</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={
                user.email ??
                user.auth0Accounts[0]?.userId ??
                user.localRows[0]?.id
              }
              className="border-b border-gray-200 align-top"
            >
              <td className="py-2 pr-4">{user.name}</td>
              <td className="py-2 pr-4">
                {user.email ?? <span className="text-gray-500">No email</span>}
                {user.localRows.length > 1 && (
                  <span className="block text-sm text-alert-800">
                    {user.localRows.length} database rows share this address
                  </span>
                )}
                {user.auth0Accounts.length > 1 && (
                  <span className="block text-sm text-alert-800">
                    {user.auth0Accounts.length} separate Auth0 accounts (
                    {user.auth0Accounts
                      .map((a) => a.connection ?? "unknown")
                      .join(", ")}
                    ), not linked
                  </span>
                )}
              </td>
              <td className="py-2 pr-4">
                {roleBadges(user).map((badge) =>
                  renderBadge(badge, `${user.email}-${badge.label}`)
                )}
              </td>
              <td className="py-2 pr-4">{renderBadge(loginBadge(user))}</td>
              <td className="py-2">
                {renderBadge(PRESENCE_BADGE[user.presence])}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
