import { Fragment } from "react"
import { type LoaderFunctionArgs, data, useLoaderData } from "react-router"
import Main from "~/components/elements/Layouts/Main"
import { PageHeader } from "~/components/elements/Headings/PageHeader"
import { DefaultErrorBoundary } from "~/components/elements/DefaultErrorBoundary"
import { Link } from "~/components/elements/LinksAndButtons/Link"
import LookupRowsTable from "~/components/frequencyIndex/LookupRowsTable"
import { formatCount } from "~/models/frequencyIndex"
import { getFrequencyLookup } from "~/models/frequencyIndex.server"
import { redirectIfUserLacksPermission } from "~/services/auth/session.server"
import { FREQUENCY_INDEX_PERMISSION } from "./index"

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await redirectIfUserLacksPermission(request, FREQUENCY_INDEX_PERMISSION)

  const id = Number(params.id)
  const lookup = Number.isInteger(id) ? await getFrequencyLookup(id) : null
  if (!lookup) throw data({ message: "Lookup not found" }, { status: 404 })

  return { lookup }
}

const userName = (u: { first_name: string | null; last_name: string | null }) =>
  [u.first_name, u.last_name].filter(Boolean).join(" ") || "unknown user"

export default function FrequencyLookupPage() {
  const { lookup } = useLoaderData<typeof loader>()

  const repeatParams = new URLSearchParams({
    term: lookup.term,
    normalizer: lookup.normalizer,
    exclusions: lookup.exclusions ?? "",
    multiplier: String(lookup.multiplier),
  })

  return (
    <Main>
      <PageHeader>
        Frequency Index: <span className="italic">{lookup.term}</span>
      </PageHeader>

      <dl className="mb-6 grid max-w-2xl grid-cols-[max-content_1fr] gap-x-6 gap-y-1">
        <dt className="font-semibold">Normalizer</dt>
        <dd>{lookup.normalizer}</dd>
        <dt className="font-semibold">Exclusions</dt>
        <dd>
          {lookup.exclusions || <span className="text-gray-500">none</span>}
        </dd>
        <dt className="font-semibold">Multiplier</dt>
        <dd>{formatCount(lookup.multiplier)}</dd>
        <dt className="font-semibold">Counts from</dt>
        <dd>
          {lookup.backend === "browser"
            ? "google.com, read by hand"
            : lookup.backend}
          {lookup.hl && (
            <Fragment>
              {" "}
              (hl={lookup.hl}
              {lookup.gl && `, gl=${lookup.gl}`})
            </Fragment>
          )}
        </dd>
        <dt className="font-semibold">Recorded</dt>
        <dd>
          {new Date(lookup.created).toLocaleDateString("en-CA")} by{" "}
          {userName(lookup.user)}
        </dd>
      </dl>

      <LookupRowsTable rows={lookup.rows} multiplier={lookup.multiplier} />

      <p className="mt-6 flex gap-6">
        <Link to={`/frequency-index?${repeatParams}`}>Repeat this lookup</Link>
        <Link to="/frequency-index">Look up another term</Link>
      </p>
    </Main>
  )
}

export const ErrorBoundary = DefaultErrorBoundary
