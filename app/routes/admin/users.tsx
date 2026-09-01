import { type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router"
import { useLoaderData, useSearchParams } from "react-router"
import { PageHeader } from "~/components/elements/Headings/PageHeader"
import PaginationControl from "~/components/bank/PaginationControl"
import UserDirectoryTable from "~/components/admin/UserDirectoryTable"
import { redirectIfUserLacksPermission } from "~/services/auth/session.server"
import { getUserDirectory } from "~/services/auth/userDirectory.server"
import {
  isFullyBlocked,
  isLegacyUser,
  isSortColumn,
  sortDirectoryUsers,
  USER_DIRECTORY_PAGE_SIZE,
  type SortColumn,
  type SortDirection,
} from "~/services/auth/userDirectory"

// The administrator-only user management screen. This issue is the list; the
// create, change-role and deactivate actions are #443, #444 and #445.
//
// The loader guard and the action guard are separate. A loader guard alone
// protects only what a person can see; a form post goes to the action and
// would never touch the loader.

export const MANAGE_USERS_PERMISSION = "det:manageUsers" as const

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await redirectIfUserLacksPermission(request, MANAGE_USERS_PERMISSION)

  // getUserDirectory reports an unreachable Auth0 in its return value rather
  // than throwing, so the page can still show the local rows.
  return await getUserDirectory()
}

export const action = async ({ request }: ActionFunctionArgs) => {
  await redirectIfUserLacksPermission(request, MANAGE_USERS_PERMISSION)
  return null
}

/**
 * Sorting and paging are query-string only, and the loader reads every Auth0
 * account, every role's membership and every local row to build its answer.
 * Re-running it to reorder data already in the browser would spend Management
 * API rate limit for nothing, so it runs again only when the path changes or
 * something was submitted.
 */
export function shouldRevalidate({
  currentUrl,
  nextUrl,
  formMethod,
}: {
  currentUrl: URL
  nextUrl: URL
  formMethod?: string
}) {
  if (formMethod && formMethod !== "GET") return true
  return currentUrl.pathname !== nextUrl.pathname
}

export default function AdminUsers() {
  const { users, auth0Error } = useLoaderData<typeof loader>()
  const [searchParams, setSearchParams] = useSearchParams()

  const sortParam = searchParams.get("sort")
  const sort: SortColumn = isSortColumn(sortParam) ? sortParam : "name"
  const direction: SortDirection =
    searchParams.get("dir") === "desc" ? "desc" : "asc"

  // Two groups are hidden by default, both for the same reason: this page is
  // for managing who has access, and neither group has any. Each count stays
  // on screen so that hiding them is visible rather than silent.
  //
  // Someone only partly blocked is NOT hidden. They can still log in, so they
  // are precisely the row worth seeing.
  const filters = [
    {
      key: "legacy",
      matches: isLegacyUser,
      label: (n: number) =>
        `Show ${n} legacy ${n === 1 ? "contributor" : "contributors"}`,
      hint: "Contributed before this site used Auth0. No account, so no way to log in.",
    },
    {
      key: "blocked",
      matches: isFullyBlocked,
      label: (n: number) =>
        `Show ${n} blocked ${n === 1 ? "person" : "people"}`,
      hint: "Every Auth0 account they hold is blocked, so they cannot log in.",
    },
  ] as const

  const hidden = filters.filter((f) => searchParams.get(f.key) !== "show")
  const visible = users.filter((user) => !hidden.some((f) => f.matches(user)))

  const sorted = sortDirectoryUsers(visible, sort, direction)

  const pageCount = Math.max(
    1,
    Math.ceil(sorted.length / USER_DIRECTORY_PAGE_SIZE)
  )
  // A page number out of range, from an edited URL or a stale link, shows the
  // nearest real page rather than an empty table.
  const requestedPage = Number(searchParams.get("page")) || 1
  const page = Math.min(Math.max(1, requestedPage), pageCount)

  const start = (page - 1) * USER_DIRECTORY_PAGE_SIZE
  const pageOfUsers = sorted.slice(start, start + USER_DIRECTORY_PAGE_SIZE)

  return (
    <div className="mt-8">
      <PageHeader>Manage users</PageHeader>

      {auth0Error && (
        <div
          role="alert"
          className="my-4 border-l-4 border-amber-500 bg-amber-50 p-4"
        >
          <p className="font-semibold">Auth0 could not be reached.</p>
          <p className="mt-1">
            The people below are the rows in this site's own database. Roles and
            login accounts are not shown, because they live in Auth0. Nobody has
            lost access — this page could not read it.
          </p>
          <p className="mt-1 text-sm text-gray-700">{auth0Error.message}</p>
        </div>
      )}

      <p className="my-4">
        {visible.length} {visible.length === 1 ? "person" : "people"}, from
        Auth0 and from this site's database.
        {pageCount > 1 && (
          <span className="text-gray-600">
            {" "}
            Showing {start + 1}&ndash;{start + pageOfUsers.length}, page {page}{" "}
            of {pageCount}.
          </span>
        )}
      </p>

      <div className="my-4 flex flex-col gap-2">
        {filters.map((filter) => {
          const count = users.filter(filter.matches).length
          if (count === 0) return null
          const checked = searchParams.get(filter.key) === "show"

          return (
            <label key={filter.key} className="flex items-start gap-2">
              <input
                type="checkbox"
                className="mt-1"
                checked={checked}
                onChange={(event) => {
                  const next = new URLSearchParams(searchParams)
                  if (event.target.checked) next.set(filter.key, "show")
                  else next.delete(filter.key)
                  // The page number means something different once the list
                  // changes length.
                  next.delete("page")
                  setSearchParams(next, { preventScrollReset: true })
                }}
              />
              <span>
                {filter.label(count)}
                <span className="ml-1 text-gray-600">— {filter.hint}</span>
              </span>
            </label>
          )
        })}
      </div>

      <UserDirectoryTable
        users={pageOfUsers}
        sort={sort}
        direction={direction}
        searchParams={searchParams}
      />

      {pageCount > 1 && (
        <div className="my-6">
          <PaginationControl
            baseLink=""
            currentPage={page}
            pageCount={pageCount}
            useSearch="page"
            searchParams={searchParams}
          />
        </div>
      )}
    </div>
  )
}
