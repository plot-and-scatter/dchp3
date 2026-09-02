import { type LoaderFunctionArgs } from "react-router"
import { useLoaderData, useSearchParams } from "react-router"
import { Link } from "~/components/elements/LinksAndButtons/Link"
import { PageHeader } from "~/components/elements/Headings/PageHeader"
import PaginationControl from "~/components/bank/PaginationControl"
import UserDirectoryTable from "~/components/admin/UserDirectoryTable"
import { redirectIfUserLacksPermission } from "~/services/auth/session.server"
import { MANAGE_USERS_PERMISSION } from "../users"
import { getUserDirectory } from "~/services/auth/userDirectory.server"
import {
  DEFAULT_ACCESS_FILTER,
  DEFAULT_ROLE_FILTER,
  isAccessFilter,
  isRoleFilter,
  isSortColumn,
  matchesAccessFilter,
  matchesRoleFilter,
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

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await redirectIfUserLacksPermission(request, MANAGE_USERS_PERMISSION)

  // getUserDirectory reports an unreachable Auth0 in its return value rather
  // than throwing, so the page can still show the local rows.
  return await getUserDirectory()
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

  // Filtering happens in the column headings. The access filter defaults to
  // "active" rather than "everyone": most of the list is legacy contributors,
  // and a page for managing access should not open on people who have none.
  const roleParam = searchParams.get("role")
  const roleFilter = isRoleFilter(roleParam) ? roleParam : DEFAULT_ROLE_FILTER
  const accessParam = searchParams.get("access")
  const accessFilter = isAccessFilter(accessParam)
    ? accessParam
    : DEFAULT_ACCESS_FILTER

  const visible = users.filter(
    (user) =>
      matchesRoleFilter(user, roleFilter) &&
      matchesAccessFilter(user, accessFilter)
  )

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
            The people below are the rows in the DCHP database. Roles and login
            accounts are not shown, because they live in Auth0. Nobody has lost
            access — this page could not read it.
          </p>
          <p className="mt-1 text-sm text-gray-700">{auth0Error.message}</p>
        </div>
      )}

      <p className="my-4">
        <Link to="/admin/users/new" asButton buttonVariant="outline">
          Add someone
        </Link>
      </p>

      <p className="my-4">
        {visible.length} {visible.length === 1 ? "person" : "people"}
        {visible.length === users.length
          ? ", from Auth0 and from the DCHP database."
          : ` of ${users.length}, filtered by the column headings.`}
        {pageCount > 1 && (
          <span className="text-gray-600">
            {" "}
            Showing {start + 1}&ndash;{start + pageOfUsers.length}, page {page}{" "}
            of {pageCount}.
          </span>
        )}
      </p>

      <UserDirectoryTable
        users={pageOfUsers}
        sort={sort}
        direction={direction}
        searchParams={searchParams}
        roleFilter={roleFilter}
        accessFilter={accessFilter}
        onFilterChange={(next) =>
          setSearchParams(next, { preventScrollReset: true })
        }
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
