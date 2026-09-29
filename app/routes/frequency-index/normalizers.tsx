import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  Form,
  data,
  useActionData,
  useLoaderData,
} from "react-router"
import DeleteIcon from "~/components/elements/Icons/DeleteIcon"
import Main from "~/components/elements/Layouts/Main"
import { PageHeader } from "~/components/elements/Headings/PageHeader"
import { DefaultErrorBoundary } from "~/components/elements/DefaultErrorBoundary"
import { Link } from "~/components/elements/LinksAndButtons/Link"
import NormalizerHistoryChart from "~/components/frequencyIndex/NormalizerHistoryChart"
import {
  DEFAULT_NORMALIZER,
  FREQUENCY_DOMAINS,
  formatCount,
} from "~/models/frequencyIndex"
import {
  deleteNormalizerCount,
  getNormalizerHistory,
  listNormalizers,
} from "~/models/frequencyIndex.server"
import { redirectIfUserLacksPermission } from "~/services/auth/session.server"
import { userName } from "~/components/frequencyIndex/userName"
import { FREQUENCY_INDEX_PERMISSION } from "./index"

// How Google's count for the normalizer has moved over time, per domain.
// The normalizer stands in for the size of each national web, so a jump
// here changes every index computed after it; this page makes such jumps
// visible instead of leaving them buried in individual lookups.

const RANGES = [
  { days: 30, label: "30 days" },
  { days: 90, label: "90 days" },
  { days: 365, label: "1 year" },
  { days: 0, label: "All time" },
]
const DEFAULT_DAYS = 90

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await redirectIfUserLacksPermission(request, FREQUENCY_INDEX_PERMISSION)

  const params = new URL(request.url).searchParams
  const normalizers = await listNormalizers()
  const normalizer =
    params.get("normalizer")?.trim() ||
    normalizers[0]?.normalizer ||
    DEFAULT_NORMALIZER
  const daysParam = Number(params.get("days"))
  const days = RANGES.some((r) => r.days === daysParam)
    ? daysParam
    : DEFAULT_DAYS
  const since = days > 0 ? new Date(Date.now() - days * 24 * 3600 * 1000) : null

  const history = await getNormalizerHistory(normalizer, since)
  return { normalizer, normalizers, days, history }
}

// The only action is deleting one standalone observation, such as a
// spreadsheet row that was typed wrongly. An observation a lookup uses
// cannot be deleted from here; correct it from that lookup instead.
export const action = async ({ request }: ActionFunctionArgs) => {
  await redirectIfUserLacksPermission(request, FREQUENCY_INDEX_PERMISSION)

  const formData = await request.formData()
  const id = Number(formData.get("countId"))
  if (formData.get("intent") !== "delete" || !Number.isInteger(id))
    throw data({ message: "Unknown action" }, { status: 400 })

  const result = await deleteNormalizerCount(id)
  return result.deleted
    ? { kind: "deleted" as const, id }
    : { kind: "inUse" as const, id, usedBy: result.usedBy }
}

export default function NormalizerHistoryPage() {
  const { normalizer, normalizers, days, history } =
    useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()

  const href = (n: string, d: number) =>
    `/frequency-index/normalizers?${new URLSearchParams({
      normalizer: n,
      days: String(d),
    })}`

  const observations = Object.values(history).flat()
  const dates = [...new Set(observations.map((p) => p.observed))].sort()

  return (
    <Main>
      <div className="admin-ui font-ui">
        <PageHeader>
          Normalizer history: <span className="italic">{normalizer}</span>
        </PageHeader>

        <p className="mb-6 max-w-3xl">
          Every count of the normalizer read from Google, one line per domain,
          in date order. Each count is stored once, however many lookups reused
          it. The counts come from saved lookups and from counts recorded on
          their own, such as the spreadsheet kept before this tool existed.
        </p>
        <p className="mb-6 max-w-3xl">
          Why it matters: a term&rsquo;s index is its hits divided by the
          normalizer&rsquo;s hits. If Google&rsquo;s count for the normalizer
          jumps, every index computed after the jump is on a different scale
          from those computed before it. Check here before comparing lookups
          made weeks apart.
        </p>

        <div className="mb-6 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-semibold">Normalizer</span>
            {normalizers.length === 0 && (
              <span className="text-gray-500">none saved yet</span>
            )}
            {normalizers.map((n) => (
              <Pill
                key={n.normalizer}
                to={href(n.normalizer, days)}
                active={n.normalizer === normalizer}
                title={`${n.counts} count${n.counts === 1 ? "" : "s"}`}
              >
                {n.normalizer}
              </Pill>
            ))}
          </span>
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-semibold">Range</span>
            {RANGES.map((r) => (
              <Pill
                key={r.days}
                to={href(normalizer, r.days)}
                active={r.days === days}
              >
                {r.label}
              </Pill>
            ))}
          </span>
        </div>

        {actionData?.kind === "inUse" && (
          <p
            role="alert"
            className="my-4 max-w-2xl border-l-4 border-red-500 bg-red-50 p-3"
          >
            That count was not deleted: it is used by{" "}
            {actionData.usedBy.map((l, i) => (
              <span key={l.id}>
                {i > 0 && ", "}
                <Link to={`/frequency-index/${l.id}`}>
                  the lookup of &ldquo;{l.term}&rdquo;
                </Link>
              </span>
            ))}
            . Correct it from there, or delete those lookups first.
          </p>
        )}

        {observations.length === 0 ? (
          <p className="text-gray-600">
            No counts of &ldquo;{normalizer}&rdquo; were saved in this range.
          </p>
        ) : (
          <NormalizerHistoryChart history={history} normalizer={normalizer} />
        )}

        {dates.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-3 text-xl font-semibold">
              The same counts as a table
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-400">
                    <th className="py-2 pr-4">Date</th>
                    {FREQUENCY_DOMAINS.map((d) => (
                      <th key={d.key} className="py-2 pr-4 text-right">
                        {d.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dates.map((date) => (
                    <tr key={date} className="border-b border-gray-200">
                      <td className="py-2 pr-4">{date}</td>
                      {FREQUENCY_DOMAINS.map((d) => {
                        const onDate = (history[d.key] ?? []).filter(
                          (p) => p.observed === date
                        )
                        return (
                          <td
                            key={d.key}
                            className="py-2 pr-4 text-right tabular-nums"
                          >
                            {onDate.map((p) => (
                              <div
                                key={p.id}
                                className="flex items-center justify-end gap-1"
                              >
                                {p.lookup ? (
                                  <Link
                                    to={`/frequency-index/${p.lookup.id}`}
                                    title={`Read while looking up “${
                                      p.lookup.term
                                    }” by ${userName(p.user)}`}
                                  >
                                    {formatCount(p.hits)}
                                  </Link>
                                ) : (
                                  <span
                                    title={`From ${
                                      p.source
                                    }, recorded by ${userName(p.user)}`}
                                  >
                                    {formatCount(p.hits)}
                                  </span>
                                )}
                                <Form
                                  method="post"
                                  onSubmit={(e) => {
                                    if (
                                      !window.confirm(
                                        `Delete the ${p.domainKey.toUpperCase()} count of ${formatCount(
                                          p.hits
                                        )} from ${p.observed}?`
                                      )
                                    )
                                      e.preventDefault()
                                  }}
                                >
                                  <input
                                    type="hidden"
                                    name="intent"
                                    value="delete"
                                  />
                                  <input
                                    type="hidden"
                                    name="countId"
                                    value={p.id}
                                  />
                                  <button
                                    type="submit"
                                    className="text-gray-400 hover:text-red-700"
                                    title="Delete this count"
                                    aria-label={`Delete the ${p.domainKey} count from ${p.observed}`}
                                  >
                                    <DeleteIcon />
                                  </button>
                                </Form>
                              </div>
                            ))}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <p className="mt-8">
          <Link to="/frequency-index">Back to the Frequency Index</Link>
        </p>
      </div>
    </Main>
  )
}

function Pill({
  to,
  active,
  title,
  children,
}: {
  to: string
  active: boolean
  title?: string
  children: React.ReactNode
}) {
  return (
    <Link
      to={to}
      title={title}
      className={
        "rounded-full border px-3 py-1 no-underline " +
        (active
          ? "border-blue-700 bg-blue-700 text-white"
          : "border-gray-300 bg-white text-gray-800 hover:bg-gray-100")
      }
    >
      {children}
    </Link>
  )
}

export const ErrorBoundary = DefaultErrorBoundary
