import { type LoaderFunctionArgs, Form, useLoaderData } from "react-router"
import Main from "~/components/elements/Layouts/Main"
import { PageHeader } from "~/components/elements/Headings/PageHeader"
import BackLink from "~/components/frequencyIndex/BackLink"
import Button from "~/components/elements/LinksAndButtons/Button"
import { DefaultErrorBoundary } from "~/components/elements/DefaultErrorBoundary"
import Input from "~/components/bank/Input"
import { Link } from "~/components/elements/LinksAndButtons/Link"
import LookupsTable from "~/components/frequencyIndex/LookupsTable"
import { formatCount } from "~/models/frequencyIndex"
import {
  LOOKUPS_PAGE_SIZE,
  listFrequencyLookups,
} from "~/models/frequencyIndex.server"
import { redirectIfUserLacksPermission } from "~/services/auth/session.server"
import { FREQUENCY_INDEX_PERMISSION } from "./index"

// Every saved lookup, newest first. The form page lists only the newest 25,
// which left older lookups with no way to reach them (Natalia, 2026-11-24).

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await redirectIfUserLacksPermission(request, FREQUENCY_INDEX_PERMISSION)

  const params = new URL(request.url).searchParams
  const search = (params.get("term") ?? "").trim()
  const result = await listFrequencyLookups({
    page: Number(params.get("page") ?? 1),
    search,
  })
  return { ...result, search, pageSize: LOOKUPS_PAGE_SIZE }
}

export default function AllLookupsPage() {
  const { lookups, total, page, pageCount, search, pageSize } =
    useLoaderData<typeof loader>()

  const href = (p: number) => {
    const params = new URLSearchParams()
    if (search) params.set("term", search)
    if (p > 1) params.set("page", String(p))
    const query = params.toString()
    return `/frequency-index/lookups${query ? `?${query}` : ""}`
  }

  const first = (page - 1) * pageSize + 1
  const last = first + lookups.length - 1

  return (
    <Main>
      <div className="admin-ui font-ui">
        <PageHeader>All lookups</PageHeader>
        <BackLink />

        <Form method="get" className="mb-6 flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold">Term contains</span>
            <Input
              name="term"
              defaultValue={search}
              placeholder="e.g. toque"
              autoComplete="off"
              lightBorder
            />
          </label>
          <Button type="submit" appearance="primary" size="small">
            Find
          </Button>
          {search && <Link to="/frequency-index/lookups">Show all</Link>}
        </Form>

        {total === 0 ? (
          <p>
            {search
              ? `No saved lookup has a term containing “${search}”.`
              : "No lookups have been saved yet."}
          </p>
        ) : (
          <div>
            <p className="mb-3 text-sm text-gray-600">
              {formatCount(first)}&ndash;{formatCount(last)} of{" "}
              {formatCount(total)} lookup{total === 1 ? "" : "s"}
              {search ? ` with a term containing “${search}”` : ""}, newest
              first.
            </p>
            <LookupsTable lookups={lookups} />
            {pageCount > 1 && (
              <nav
                aria-label="Pages of lookups"
                className="mt-6 flex items-center gap-6"
              >
                {page > 1 ? (
                  <Link to={href(page - 1)}>&larr; Newer</Link>
                ) : (
                  <span className="text-gray-400">&larr; Newer</span>
                )}
                <span>
                  Page {page} of {pageCount}
                </span>
                {page < pageCount ? (
                  <Link to={href(page + 1)}>Older &rarr;</Link>
                ) : (
                  <span className="text-gray-400">Older &rarr;</span>
                )}
              </nav>
            )}
          </div>
        )}
      </div>
    </Main>
  )
}

export const ErrorBoundary = DefaultErrorBoundary
