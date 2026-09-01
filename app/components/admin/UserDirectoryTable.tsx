import {
  isPartiallyBlocked,
  type DirectoryUser,
} from "~/services/auth/userDirectory.server"

// Each row says which of the two systems the person exists in, because that
// is the thing an administrator cannot otherwise find out and it decides what
// to do about them.
const PRESENCE_LABEL: Record<DirectoryUser["presence"], string> = {
  both: "Auth0 and database",
  // Not "has never logged in": the join knows only that there is no local
  // row. Every account in the tenant has in fact logged in at least once, and
  // lazy row creation only arrived in October 2023, so an older account can
  // have logged in many times and still have no row.
  auth0Only: "Auth0 only — no database record",
  localOnly: "Database only — cannot log in",
  auth0Unknown: "Database — Auth0 not read",
}

const PRESENCE_CLASS: Record<DirectoryUser["presence"], string> = {
  both: "text-gray-700",
  auth0Only: "text-amber-800",
  localOnly: "text-amber-800",
  auth0Unknown: "text-gray-500",
}

function StatusCell({ user }: { user: DirectoryUser }) {
  // Some accounts blocked and others not means the person can still log in
  // through the ones that are not. Worth saying outright rather than picking
  // one of the two answers.
  if (isPartiallyBlocked(user)) {
    return (
      <span className="text-red-800">
        Partly deactivated — can still log in
      </span>
    )
  }

  const blocked =
    user.auth0Accounts.length > 0 && user.auth0Accounts.every((a) => a.blocked)
  if (blocked) return <span className="text-red-800">Deactivated</span>

  // is_active is set on every login, so a local row says only that they have
  // logged in at some point. Auth0's blocked flag is what stops a login.
  const active = user.localRows.some((row) => row.is_active === 1)

  if (user.presence === "auth0Only") return <span>No local record yet</span>
  return <span>{active ? "Active" : "Inactive"}</span>
}

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
            <th className="py-2 pr-4">Status</th>
            <th className="py-2">Account</th>
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
                  <span className="block text-sm text-amber-800">
                    {user.localRows.length} database rows share this address
                  </span>
                )}
                {user.auth0Accounts.length > 1 && (
                  <span className="block text-sm text-amber-800">
                    {user.auth0Accounts.length} separate Auth0 accounts (
                    {user.auth0Accounts
                      .map((a) => a.connection ?? "unknown")
                      .join(", ")}
                    ), not linked
                  </span>
                )}
              </td>
              <td className="py-2 pr-4">
                {user.roles.length > 0 ? (
                  user.roles.join(", ")
                ) : (
                  <span className="text-gray-500">
                    {user.presence === "localOnly" ||
                    user.presence === "auth0Unknown"
                      ? "—"
                      : "No role assigned"}
                  </span>
                )}
              </td>
              <td className="py-2 pr-4">
                <StatusCell user={user} />
              </td>
              <td className={`py-2 ${PRESENCE_CLASS[user.presence]}`}>
                {PRESENCE_LABEL[user.presence]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
