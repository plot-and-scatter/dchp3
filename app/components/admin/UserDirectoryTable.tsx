import StatusBadge, {
  type BadgeTone,
} from "~/components/elements/Labels/StatusBadge"
// Not from userDirectory.server: isPartiallyBlocked is a value, and importing
// it from the server module pulls ~/db.server into the client bundle.
import type { AuthRole } from "~/services/auth/AuthRole"
import {
  ACCESS_FILTERS,
  ACCESS_FILTER_LABELS,
  isFullyBlocked,
  isPartiallyBlocked,
  lastLoginAt,
  ROLE_FILTERS,
  ROLE_FILTER_LABELS,
  totalContributions,
  totalLogins,
  type AccessFilter,
  type DirectoryUser,
  type RoleFilter,
  type SortColumn,
  type SortDirection,
} from "~/services/auth/userDirectory"
import { Link } from "~/components/elements/LinksAndButtons/Link"
import FAIcon from "~/components/elements/Icons/FAIcon"
import Button from "~/components/elements/LinksAndButtons/Button"

// Two questions decide what an administrator does about a row, and neither was
// legible before: can this person log in, and are they allowed to do anything
// once they have. Both are badges rather than prose.

type Badge = {
  label: string
  tone: BadgeTone
  title?: string
  iconName?: string
  iconStyle?: string
}

// One icon per role, reading as what the role lets a person do: look at the
// dictionary, edit it, research it, or administer the site. Every name here is
// checked against the Font Awesome kit in use, which is a v6 kit still carrying
// v5 names -- fa-magnifying-glass is absent where fa-search is present.
const ROLE_ICONS: Record<AuthRole, string> = {
  Display: "fa-eye",
  "Student / Editor": "fa-pen-to-square",
  "Research Assistant": "fa-user-magnifying-glass",
  Superadmin: "fa-shield-halved",
}

// Colour by seniority: barely a badge at all for Display, grey, blue, then
// purple for the role that can do anything.
//
// Purple rather than red, and green is not used here at all. Both of those
// mean something in the Auth0 login column four columns over -- red is
// blocked, green is can log in -- and a colour should not mean two things on
// one screen. Holding the Superadmin role is not a danger either way.
const ROLE_TONES: Record<AuthRole, BadgeTone> = {
  Display: "plain",
  "Student / Editor": "neutral",
  "Research Assistant": "info",
  Superadmin: "privileged",
}

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
      // Neutral, not a warning: a legacy contributor having no account is the
      // expected state, not a problem to fix.
      label: "No account",
      tone: "neutral",
      title:
        "No Auth0 account, so no way to log in. Usual for a legacy contributor.",
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

  if (isFullyBlocked(user)) {
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
    return user.roles.map((role) => ({
      label: role,
      tone: ROLE_TONES[role],
      iconName: ROLE_ICONS[role],
    }))
  }

  if (user.auth0Accounts.length > 0) {
    return [
      {
        label: "No role",
        tone: "warning",
        iconName: "fa-exclamation-circle",
        title:
          "Can log in but holds no role, so has no permission at all. Worth checking how this account was created.",
      },
    ]
  }

  return [{ label: "—", tone: "neutral" }]
}

const renderBadge = (
  { label, tone, title, iconName, iconStyle }: Badge,
  key?: string
) => (
  <StatusBadge
    key={key ?? label}
    tone={tone}
    title={title}
    iconName={iconName}
    iconStyle={iconStyle}
  >
    {label}
  </StatusBadge>
)

const COLUMNS: {
  column: SortColumn
  label: string
  filter?: "role" | "access"
  /** Numbers read better against a common right edge. */
  align?: "right"
}[] = [
  { column: "name", label: "Name" },
  { column: "email", label: "Email" },
  { column: "role", label: "Role", filter: "role" },
  { column: "contributions", label: "Contributions", align: "right" },
  { column: "lastLogin", label: "Last login" },
  { column: "login", label: "Auth0 login", filter: "access" },
]

/**
 * Entries edited and citations written. Without this, "holds no role" cannot
 * be acted on: a contributor whose role was removed and an account that
 * signed itself up and did nothing are otherwise identical rows.
 */
function ContributionsCell({ user }: { user: DirectoryUser }) {
  const { edits, citations } = user.contributions
  const total = totalContributions(user)

  if (total === 0) {
    return (
      <span
        className="text-gray-500"
        title="Has never edited or written anything."
      >
        None
      </span>
    )
  }

  return (
    <span
      className="whitespace-nowrap"
      title={`${edits} ${
        edits === 1 ? "entry edit" : "entry edits"
      }, ${citations} ${citations === 1 ? "citation" : "citations"}`}
    >
      {total.toLocaleString()}
    </span>
  )
}

/**
 * A column heading that is a link, not a button: sorting lives in the URL, so
 * the order survives a reload and can be sent to someone. Clicking the column
 * already sorted reverses it.
 */
/**
 * A filter menu in a column heading. Navigating on change keeps the state in
 * the URL alongside the sort, so a filtered view can be reloaded or sent to
 * someone. Choosing a filter drops the page number, which means something
 * different once the list changes length.
 */
function ColumnFilter<Value extends string>({
  paramName,
  value,
  options,
  labels,
  searchParams,
  onChange,
  describedBy,
}: {
  paramName: string
  value: Value
  options: readonly Value[]
  labels: Record<Value, string>
  searchParams: URLSearchParams
  onChange: (params: URLSearchParams) => void
  describedBy: string
}) {
  return (
    <select
      aria-label={`Filter by ${describedBy}`}
      value={value}
      onChange={(event) => {
        const next = new URLSearchParams(searchParams)
        next.set(paramName, event.target.value)
        next.delete("page")
        onChange(next)
      }}
      className="mt-1 block w-full border border-gray-300 bg-white p-1 text-xs font-normal"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {labels[option]}
        </option>
      ))}
    </select>
  )
}

function SortableHeader({
  column,
  label,
  filter,
  align,
  sort,
  direction,
  searchParams,
  roleFilter,
  accessFilter,
  onFilterChange,
}: {
  column: SortColumn
  label: string
  filter?: "role" | "access"
  align?: "right"
  sort: SortColumn
  direction: SortDirection
  searchParams: URLSearchParams
  roleFilter: RoleFilter
  accessFilter: AccessFilter
  onFilterChange: (params: URLSearchParams) => void
}) {
  const active = sort === column
  const nextDirection: SortDirection =
    active && direction === "asc" ? "desc" : "asc"

  const params = new URLSearchParams(searchParams)
  params.set("sort", column)
  params.set("dir", nextDirection)
  // Reordering the whole list makes the current page number meaningless.
  params.delete("page")

  return (
    <th
      className={`py-2 pr-4 text-sm ${align === "right" ? "text-right" : ""}`}
      aria-sort={
        active ? (direction === "asc" ? "ascending" : "descending") : "none"
      }
    >
      <Link to={`?${params}`} className="font-bold" preventScrollReset>
        {label}
        {active && (
          <FAIcon
            iconName={
              direction === "asc"
                ? "fa-arrow-up-short-wide"
                : "fa-arrow-down-wide-short"
            }
            className="ml-1"
          />
        )}
      </Link>

      {filter === "role" && (
        <ColumnFilter
          paramName="role"
          describedBy="role"
          value={roleFilter}
          options={ROLE_FILTERS}
          labels={ROLE_FILTER_LABELS}
          searchParams={searchParams}
          onChange={onFilterChange}
        />
      )}
      {filter === "access" && (
        <ColumnFilter
          paramName="access"
          describedBy="Auth0 login"
          value={accessFilter}
          options={ACCESS_FILTERS}
          labels={ACCESS_FILTER_LABELS}
          searchParams={searchParams}
          onChange={onFilterChange}
        />
      )}
    </th>
  )
}

/**
 * The date alone, formatted in UTC rather than the reader's locale so that the
 * server and the browser render the same string.
 *
 * The tenant is shared between development, staging and production, so this is
 * the last sign-in to any of them. The hover text says so, because the column
 * would otherwise read as use of the live site.
 */
/**
 * How this person signs in, one icon per Auth0 account.
 *
 * Deliberately not a database icon for the password connection. Auth0 calls it
 * a "database connection", but this page also talks about rows in the DCHP
 * database, and using the same word for both is what made the old wording
 * confusing. A key means a password.
 */
const CONNECTIONS = {
  "Username-Password-Authentication": {
    // Listed first so that a person with both always reads key-then-Google.
    // The order Auth0 returns accounts in is not stable, and two rows showing
    // the same pair in different orders look like different states.
    order: 0,
    iconStyle: "fas",
    iconName: "fa-key",
    className: "text-amber-500",
    description: "Signs in with an email address and password",
  },
  "google-oauth2": {
    order: 1,
    iconStyle: "fab",
    iconName: "fa-google",
    className: "text-red-600",
    description: "Signs in with Google",
  },
} as const

const connectionStyle = (connection: string | null) =>
  (connection && CONNECTIONS[connection as keyof typeof CONNECTIONS]) || {
    order: 2,
    iconStyle: "fas",
    // fa-circle-question is not in this Font Awesome kit; the v5 name is.
    iconName: "fa-question-circle",
    className: "text-gray-500",
    description: `Signs in through ${
      connection ?? "an unrecognised connection"
    }`,
  }

/**
 * How this person signs in, one icon per Auth0 account.
 *
 * Deliberately not a database icon for the password connection. Auth0 calls it
 * a "database connection", but this page also talks about rows in the DCHP
 * database, and using the same word for both is what made the old wording
 * confusing. A key means a password.
 */
function ConnectionIcons({ user }: { user: DirectoryUser }) {
  if (user.auth0Accounts.length === 0) return null

  const unlinked = user.auth0Accounts.length > 1
  const accounts = [...user.auth0Accounts].sort(
    (a, b) =>
      connectionStyle(a.connection).order - connectionStyle(b.connection).order
  )

  return (
    // Fixed width so every address begins at the same point, but the icons sit
    // at its right-hand edge rather than its left. Left-aligned they left a gap
    // between a single icon and the address it belongs to; right-aligned they
    // hug the address, and a second grows into the reserved space, still
    // visible as a filled slot down the column.
    //
    // Smaller than the surrounding text as well: they qualify the address
    // rather than compete with it.
    <span
      className="mr-3 inline-block w-8 shrink-0 whitespace-nowrap text-right text-sm"
      title={
        unlinked
          ? "Two separate Auth0 accounts on this address, not linked to each other. A role change or a block has to be applied to both."
          : undefined
      }
    >
      {accounts.map((account) => {
        const style = connectionStyle(account.connection)

        return (
          <FAIcon
            key={account.userId}
            iconStyle={style.iconStyle}
            iconName={style.iconName}
            margin="ml-1"
            className={style.className}
            // The icon carries meaning, so it needs a name of its own: `title`
            // alone is not reliably announced.
            role="img"
            aria-label={style.description}
            title={style.description}
          />
        )
      })}
    </span>
  )
}

function LastLoginCell({ user }: { user: DirectoryUser }) {
  const at = lastLoginAt(user)

  if (at === null) {
    return (
      <span
        className="text-gray-500"
        title={
          user.auth0Accounts.length === 0
            ? "No Auth0 account, so no sign-in to record."
            : "This account has never been used to sign in."
        }
      >
        Never
      </span>
    )
  }

  const logins = totalLogins(user)

  return (
    <span
      className="whitespace-nowrap"
      title={`${at}\n${logins} ${
        logins === 1 ? "sign-in" : "sign-ins"
      } in total, to any of production, staging or development.`}
    >
      {at.slice(0, 10)}
    </span>
  )
}

export default function UserDirectoryTable({
  users,
  sort,
  direction,
  searchParams,
  roleFilter,
  accessFilter,
  onFilterChange,
}: {
  users: DirectoryUser[]
  sort: SortColumn
  direction: SortDirection
  searchParams: URLSearchParams
  roleFilter: RoleFilter
  accessFilter: AccessFilter
  onFilterChange: (params: URLSearchParams) => void
}) {
  // No early return when the list is empty. The filter menus live in the table
  // head, so returning before it left a reader who had filtered down to
  // nothing with no way to undo it.
  const isEmpty = users.length === 0
  const filtered = roleFilter !== "all" || accessFilter !== "all"

  const showEveryone = () => {
    const next = new URLSearchParams(searchParams)
    next.set("role", "all")
    next.set("access", "all")
    next.delete("page")
    onFilterChange(next)
  }

  return (
    // The table scrolls inside its own box rather than making the page scroll
    // sideways on a narrow screen.
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-400">
            {COLUMNS.map(({ column, label, filter, align }) => (
              <SortableHeader
                key={column}
                column={column}
                label={label}
                filter={filter}
                align={align}
                sort={sort}
                direction={direction}
                searchParams={searchParams}
                roleFilter={roleFilter}
                accessFilter={accessFilter}
                onFilterChange={onFilterChange}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {isEmpty && (
            <tr>
              <td className="py-6 text-center" colSpan={COLUMNS.length}>
                <p>
                  {filtered
                    ? "Nobody matches these filters."
                    : "There is nobody to show."}
                </p>
                {filtered && (
                  <Button
                    type="button"
                    className="mt-2"
                    onClick={showEveryone}
                    appearance="secondary"
                  >
                    Show everyone
                  </Button>
                )}
              </td>
            </tr>
          )}
          {users.map((user) => (
            <tr
              key={
                user.email ??
                user.auth0Accounts[0]?.userId ??
                user.localRows[0]?.id
              }
              className="border-b border-gray-200 align-top"
            >
              <td className="py-2 pr-4">
                {/* The name is the way in to the person, as it is in most
                    lists. Anything done to them lives on their own page. */}
                {user.email ? (
                  <Link to={`/admin/users/${encodeURIComponent(user.email)}`}>
                    {user.name}
                  </Link>
                ) : (
                  user.name
                )}
              </td>
              <td className="py-2 pr-4">
                {/* The icons act as a gutter, so the address and anything said
                    about it line up with each other rather than with them. */}
                <div className="flex items-baseline">
                  <ConnectionIcons user={user} />
                  <div>
                    {user.email ?? (
                      <span className="text-gray-500">No email</span>
                    )}
                    {user.localRows.length > 1 && (
                      <span
                        className="block text-sm text-alert-800"
                        title="The user table has no unique index on email, so the same address can appear on more than one row. Unrelated to how they sign in."
                      >
                        {user.localRows.length} records in this site&rsquo;s own
                        database share this address
                      </span>
                    )}
                    {user.presence === "auth0Only" && (
                      <span className="mt-1 block">
                        {renderBadge({
                          label: "No local record",
                          tone: "warning",
                          title:
                            "No row in this site's database yet. One is created at first login.",
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </td>
              <td className="py-2 pr-4">
                {roleBadges(user).map((badge) =>
                  renderBadge(badge, `${user.email}-${badge.label}`)
                )}
              </td>
              {/* tabular-nums so the digits line up column-wise, not just at
                  the right edge. */}
              <td className="py-2 pr-4 text-right tabular-nums">
                <ContributionsCell user={user} />
              </td>
              <td className="py-2 pr-4">
                <LastLoginCell user={user} />
              </td>
              <td className="py-2 pr-4">{renderBadge(loginBadge(user))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
